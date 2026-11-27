// npm run apk: builds the web app, copies it into the Capacitor Android project and builds a
// debug APK signed with the fixed key in android/app/signing (so it installs over the last one).
// Output: out/<name>-<version>-debug.apk
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const android = join(root, 'android');
const brand = JSON.parse(readFileSync(join(root, 'brand.json'), 'utf8'));
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, stdio: 'inherit', env: process.env });
const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, "\\'");

console.log('\n1/4 Building the web app');
run('npx', ['vite', 'build']);

console.log('\n2/4 Setting the app name from brand.json');
const stringsPath = join(android, 'app/src/main/res/values/strings.xml');
const strings = readFileSync(stringsPath, 'utf8')
  .replace(/(<string name="app_name">)[^<]*(<\/string>)/, `$1${escapeXml(brand.name)}$2`)
  .replace(/(<string name="title_activity_main">)[^<]*(<\/string>)/, `$1${escapeXml(brand.name)}$2`);
writeFileSync(stringsPath, strings);

console.log('\n3/4 Copying the web app into the Android project');
run('npx', ['cap', 'sync', 'android']);

const localProps = join(android, 'local.properties');
if (!existsSync(localProps)) {
  const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? (existsSync('/opt/android-sdk') ? '/opt/android-sdk' : null);
  if (!sdk) throw new Error('Set ANDROID_HOME to the Android SDK, or write android/local.properties');
  writeFileSync(localProps, `sdk.dir=${sdk}\n`);
}

console.log('\n4/4 Building the debug APK');
run(process.platform === 'win32' ? 'gradlew.bat' : './gradlew', ['assembleDebug', '--console=plain'], android);

const built = join(android, 'app/build/outputs/apk/debug/app-debug.apk');
const outDir = join(root, 'out');
mkdirSync(outDir, { recursive: true });
const target = join(outDir, `${brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${version}-debug.apk`);
copyFileSync(built, target);

// Check the APK is signed with the key kept in the repo, when the SDK tools are at hand.
const sdkDir = readFileSync(localProps, 'utf8').match(/sdk\.dir=(.*)/)?.[1]?.trim();
const buildTools = sdkDir && existsSync(join(sdkDir, 'build-tools')) ? readdirSync(join(sdkDir, 'build-tools')).sort().at(-1) : null;
if (sdkDir && buildTools) {
  const apksigner = join(sdkDir, 'build-tools', buildTools, 'apksigner');
  const certs = execFileSync(apksigner, ['verify', '--print-certs', target], { encoding: 'utf8' });
  const keytool = execFileSync('keytool', ['-list', '-v', '-keystore', join(android, 'app/signing/debug.keystore'), '-storepass', 'android'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const apkSha = certs.match(/SHA-256 digest: ([0-9a-f]+)/)?.[1];
  const keySha = keytool.match(/SHA256: ([0-9A-F:]+)/)?.[1]?.replace(/:/g, '').toLowerCase();
  if (!apkSha || apkSha !== keySha) throw new Error('The APK is not signed with android/app/signing/debug.keystore');
  console.log(`\nSigned with the repo key (SHA-256 ${apkSha.slice(0, 16)}…).`);
}

console.log(`\nAPK: ${target} (${(statSync(target).size / 1024 / 1024).toFixed(1)} MB)`);
