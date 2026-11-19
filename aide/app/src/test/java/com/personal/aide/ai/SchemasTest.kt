package com.personal.aide.ai

import com.personal.aide.data.ActionItem
import com.personal.aide.data.AideJson
import com.personal.aide.data.DayPlan
import com.personal.aide.data.EarlierItem
import com.personal.aide.data.GoalRead
import com.personal.aide.data.InterviewTurn
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.PersonAgenda
import com.personal.aide.data.ProgressUpdate
import com.personal.aide.data.WeekPlan
import com.personal.aide.data.WeekReview
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.Ownership
import com.personal.aide.domain.knowledgeTypeOf
import com.personal.aide.domain.ownershipOf
import com.personal.aide.domain.priorityOf
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.descriptors.StructureKind
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.boolean
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * The reply shapes sent to Claude as structured-output schemas. The API rejects a schema in which
 * any object allows extra properties or leaves one of its properties optional, and a reply is
 * only useful if it reads straight into the classes in data/Models.kt.
 */
@OptIn(ExperimentalSerializationApi::class)
class SchemasTest {
    private data class Shape(val name: String, val schema: JsonObject, val serializer: KSerializer<*>)

    private val shapes = listOf(
        Shape("meetingAnalysis", Schemas.meetingAnalysis, MeetingAnalysis.serializer()),
        Shape("interviewTurn", Schemas.interviewTurn, InterviewTurn.serializer()),
        Shape("dayPlan", Schemas.dayPlan, DayPlan.serializer()),
        Shape("weekPlan", Schemas.weekPlan, WeekPlan.serializer()),
        Shape("weekReview", Schemas.weekReview, WeekReview.serializer()),
        Shape("progressUpdate", Schemas.progressUpdate, ProgressUpdate.serializer()),
        Shape("personAgenda", Schemas.personAgenda, PersonAgenda.serializer()),
    )

    /** Every schema node under [schema], with a path saying where it is. */
    private fun nodes(path: String, schema: JsonObject): List<Pair<String, JsonObject>> = buildList {
        add(path to schema)
        (schema["properties"] as? JsonObject)?.forEach { (name, child) -> addAll(nodes("$path.$name", child.jsonObject)) }
        (schema["items"] as? JsonObject)?.let { addAll(nodes("$path[]", it)) }
    }

    private fun allNodes(): List<Pair<String, JsonObject>> = shapes.flatMap { nodes(it.name, it.schema) }

    private fun typeOf(node: JsonObject): String = node.getValue("type").jsonPrimitive.content

    // -------------------------------------------------------------------------------------------
    // What the API insists on

    @Test
    fun `every object forbids extra properties`() {
        val objects = allNodes().filter { typeOf(it.second) == "object" }
        assertTrue("expected nested objects to be checked too", objects.size > shapes.size)
        for ((path, node) in objects) {
            val extras = node["additionalProperties"]
            assertTrue("$path must set additionalProperties to false", extras is JsonPrimitive && !extras.isString && !extras.boolean)
        }
    }

    @Test
    fun `every object requires every one of its properties`() {
        for ((path, node) in allNodes().filter { typeOf(it.second) == "object" }) {
            val properties = node.getValue("properties").jsonObject.keys
            val required = node.getValue("required").jsonArray.map { it.jsonPrimitive.content }
            assertTrue("$path has no properties", properties.isNotEmpty())
            assertEquals("$path lists a property twice in required", required.size, required.toSet().size)
            assertEquals("$path: required must name exactly the properties", properties, required.toSet())
        }
    }

    @Test
    fun `the top of every schema is an object`() {
        for (shape in shapes) assertEquals(shape.name, "object", typeOf(shape.schema))
    }

    @Test
    fun `every node has a type the API supports`() {
        val supported = setOf("object", "array", "string", "integer", "number", "boolean")
        for ((path, node) in allNodes()) {
            assertTrue("$path: ${node["type"]}", node["type"] is JsonPrimitive && typeOf(node) in supported)
        }
    }

    @Test
    fun `only keywords structured outputs accept are used`() {
        val allowed = setOf("type", "description", "properties", "required", "additionalProperties", "items", "enum")
        for ((path, node) in allNodes()) {
            assertEquals("$path uses unsupported keywords", emptySet<String>(), node.keys - allowed)
        }
    }

    @Test
    fun `arrays say what they hold`() {
        val arrays = allNodes().filter { typeOf(it.second) == "array" }
        assertTrue(arrays.isNotEmpty())
        for ((path, node) in arrays) assertTrue("$path has no items", node["items"] is JsonObject)
    }

    @Test
    fun `choices are non-empty lists of distinct strings`() {
        val choices = allNodes().filter { it.second.containsKey("enum") }
        assertTrue(choices.isNotEmpty())
        for ((path, node) in choices) {
            assertEquals(path, "string", typeOf(node))
            val values = node.getValue("enum").jsonArray.map {
                assertTrue("$path: $it", it is JsonPrimitive && it.isString)
                it.jsonPrimitive.content
            }
            assertTrue(path, values.isNotEmpty())
            assertEquals(path, values.size, values.toSet().size)
        }
    }

    @Test
    fun `every field tells Claude what it is for`() {
        for ((path, node) in allNodes()) {
            // What a list holds is described by the list itself, and the top of a schema by the prompt.
            if (path.endsWith("[]") || shapes.any { it.name == path }) continue
            val description = node["description"]?.jsonPrimitive?.content.orEmpty()
            assertTrue("$path has no description", description.isNotBlank())
        }
    }

    // -------------------------------------------------------------------------------------------
    // Agreement with the classes the replies are read into

    private fun assertMatches(path: String, schema: JsonObject, descriptor: SerialDescriptor) {
        when (typeOf(schema)) {
            "object" -> {
                assertEquals("$path should be read into a class", StructureKind.CLASS, descriptor.kind)
                val properties = schema.getValue("properties").jsonObject
                val fields = (0 until descriptor.elementsCount).map { descriptor.getElementName(it) }
                assertEquals("$path: the schema's properties and the class's serialized names differ", fields.toSet(), properties.keys)
                for (index in 0 until descriptor.elementsCount) {
                    val name = descriptor.getElementName(index)
                    assertMatches("$path.$name", properties.getValue(name).jsonObject, descriptor.getElementDescriptor(index))
                }
            }
            "array" -> {
                assertEquals("$path should be read into a list", StructureKind.LIST, descriptor.kind)
                assertMatches("$path[]", schema.getValue("items").jsonObject, descriptor.getElementDescriptor(0))
            }
            "string" -> assertEquals("$path should be read into a String", PrimitiveKind.STRING, descriptor.kind)
            "boolean" -> assertEquals("$path should be read into a Boolean", PrimitiveKind.BOOLEAN, descriptor.kind)
            "integer" -> assertTrue("$path should be read into a whole number", descriptor.kind == PrimitiveKind.LONG || descriptor.kind == PrimitiveKind.INT)
            else -> throw AssertionError("$path: unexpected type ${typeOf(schema)}")
        }
        assertFalse("$path: a required field can't be read into something nullable by accident", descriptor.isNullable)
    }

    @Test
    fun `property names and types match the classes replies are read into`() {
        for (shape in shapes) assertMatches(shape.name, shape.schema, shape.serializer.descriptor)
    }

    /** A reply that fills in every field the schema asks for, the way constrained output does. */
    private fun sample(schema: JsonObject, counter: IntArray = intArrayOf(0)): JsonElement = when (typeOf(schema)) {
        "object" -> JsonObject(schema.getValue("properties").jsonObject.mapValues { sample(it.value.jsonObject, counter) })
        "array" -> JsonArray(listOf(sample(schema.getValue("items").jsonObject, counter), sample(schema.getValue("items").jsonObject, counter)))
        "string" -> schema["enum"]?.jsonArray?.last() ?: JsonPrimitive("text ${++counter[0]}")
        "integer" -> JsonPrimitive(++counter[0])
        "boolean" -> JsonPrimitive(true)
        else -> throw AssertionError("unexpected type")
    }

    @Test
    fun `a reply that fills the schema reads into its class with nothing lost`() {
        // Strict about names: an unknown key here would mean the class has no field for something the schema asks for.
        val strict = Json { ignoreUnknownKeys = false; encodeDefaults = true }
        for (shape in shapes) {
            val reply = sample(shape.schema)
            @Suppress("UNCHECKED_CAST")
            val serializer = shape.serializer as KSerializer<Any?>
            val decoded = strict.decodeFromString(serializer, reply.toString())
            assertEquals("${shape.name}: fields changed or went missing on the way in", reply, strict.encodeToJsonElement(serializer, decoded))
            // And the app's own, more forgiving reader agrees.
            assertEquals(shape.name, decoded, AideJson.decodeFromString(serializer, reply.toString()))
        }
    }

    @Test
    fun `an all-empty reply is valid for every schema`() {
        // "Nothing to say" is empty strings and empty lists, never a missing field.
        for (shape in shapes) {
            @Suppress("UNCHECKED_CAST")
            val serializer = shape.serializer as KSerializer<Any?>
            val empty = AideJson.encodeToJsonElement(serializer, AideJson.decodeFromString(serializer, "{}")).jsonObject
            assertEquals(shape.name, shape.schema.getValue("properties").jsonObject.keys, empty.keys)
        }
    }

    // -------------------------------------------------------------------------------------------
    // Agreement with how the words are understood

    private fun enumAt(schema: JsonObject, vararg path: String): List<String> {
        var node = schema
        for (step in path) {
            node = if (step == "[]") node.getValue("items").jsonObject else node.getValue("properties").jsonObject.getValue(step).jsonObject
        }
        return node.getValue("enum").jsonArray.map { it.jsonPrimitive.content }
    }

    @Test
    fun `every ownership word the schema offers is understood`() {
        val words = enumAt(Schemas.meetingAnalysis, "action_items", "[]", "ownership")
        assertEquals(Ownership.entries.toSet(), words.map { ownershipOf(it) }.toSet())
        assertEquals(words.size, words.map { ownershipOf(it) }.toSet().size)
        assertEquals(Ownership.MINE, ownershipOf("mine"))
        assertEquals(Ownership.OTHERS, ownershipOf("others"))
        assertEquals(Ownership.UNCLEAR, ownershipOf("unclear"))
    }

    @Test
    fun `every priority word the schema offers is understood`() {
        val words = enumAt(Schemas.meetingAnalysis, "action_items", "[]", "priority")
        assertEquals(setOf(0, 1, 2), words.map { priorityOf(it) }.toSet())
        assertEquals(2, priorityOf("high"))
        assertEquals(1, priorityOf("normal"))
        assertEquals(0, priorityOf("low"))
    }

    @Test
    fun `every knowledge type the schemas offer is understood, and every type can be offered`() {
        val places = listOf(
            enumAt(Schemas.meetingAnalysis, "knowledge", "[]", "type"),
            enumAt(Schemas.meetingAnalysis, "clarifying_questions", "[]", "topic_type"),
            enumAt(Schemas.interviewTurn, "knowledge", "[]", "type"),
        )
        for (words in places) {
            val types = words.map { knowledgeTypeOf(it) }
            assertEquals("each word means a different type", words.size, types.toSet().size)
            assertEquals(KnowledgeType.entries.toSet(), types.toSet())
        }
    }

    @Test
    fun `the review's overall verdict offers the four documented words`() {
        assertEquals(listOf("strong", "steady", "mixed", "at_risk"), enumAt(Schemas.weekReview, "overall"))
        assertEquals(listOf("good", "fair", "poor"), enumAt(Schemas.meetingAnalysis, "transcript_quality"))
    }

    // -------------------------------------------------------------------------------------------
    // Recurring meetings, goals and wins

    @Test
    fun `the meeting schema asks which recurring meeting this is and what has moved since the last one`() {
        val properties = Schemas.meetingAnalysis.getValue("properties").jsonObject
        assertTrue(properties.keys.containsAll(setOf("series", "since_last_time", "earlier_items")))

        val series = properties.getValue("series").jsonObject
        assertEquals("object", typeOf(series))
        assertEquals(setOf("existing_id", "new_name"), series.getValue("properties").jsonObject.keys)
        assertEquals("a series is picked by its id, not by retyping its name", "integer", typeOf(series.getValue("properties").jsonObject.getValue("existing_id").jsonObject))

        val earlier = properties.getValue("earlier_items").jsonObject.getValue("items").jsonObject
        assertEquals(setOf("task_id", "status", "note"), earlier.getValue("properties").jsonObject.keys)
        assertEquals("integer", typeOf(earlier.getValue("properties").jsonObject.getValue("task_id").jsonObject))
    }

    @Test
    fun `what can be said about an earlier action item and about a goal are the documented words`() {
        assertEquals(listOf("done", "still_open", "dropped", "not_mentioned"), enumAt(Schemas.meetingAnalysis, "earlier_items", "[]", "status"))
        assertEquals(listOf("on_track", "at_risk", "stalled", "no_evidence"), enumAt(Schemas.progressUpdate, "goals", "[]", "status"))
    }

    @Test
    fun `a field nobody filled in holds one of the words its schema offers`() {
        // The classes' defaults stand in when a stored copy predates a field; they must still be words the app understands.
        assertTrue(EarlierItem().status in enumAt(Schemas.meetingAnalysis, "earlier_items", "[]", "status"))
        assertTrue(GoalRead().status in enumAt(Schemas.progressUpdate, "goals", "[]", "status"))
        assertTrue(ActionItem().ownership in enumAt(Schemas.meetingAnalysis, "action_items", "[]", "ownership"))
        assertTrue(ActionItem().priority in enumAt(Schemas.meetingAnalysis, "action_items", "[]", "priority"))
        assertEquals("saying nothing about an earlier item means it did not come up", "not_mentioned", EarlierItem().status)
        assertEquals("saying nothing about a goal is not a claim of progress", "no_evidence", GoalRead().status)
    }

    @Test
    fun `a win points at where it came from by id and names its goal and day`() {
        val win = Schemas.progressUpdate.getValue("properties").jsonObject.getValue("wins").jsonObject.getValue("items").jsonObject
        val properties = win.getValue("properties").jsonObject
        assertEquals(setOf("title", "detail", "goal", "day", "task_id", "meeting_id"), properties.keys)
        assertEquals("integer", typeOf(properties.getValue("task_id").jsonObject))
        assertEquals("integer", typeOf(properties.getValue("meeting_id").jsonObject))
        assertEquals("string", typeOf(properties.getValue("day").jsonObject))
    }

    @Test
    fun `an agenda has a headline, topics with reasons, and things to ask and to tell`() {
        val properties = Schemas.personAgenda.getValue("properties").jsonObject
        assertEquals(setOf("headline", "items", "to_ask", "to_tell"), properties.keys)
        assertEquals(setOf("topic", "why"), properties.getValue("items").jsonObject.getValue("items").jsonObject.getValue("properties").jsonObject.keys)
    }
}
