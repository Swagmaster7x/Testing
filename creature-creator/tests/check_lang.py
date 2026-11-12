import json,re,sys
keys=json.load(open('' + __import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '..', 'web', 'src', 'lang') + '/keys.json'))
ok=True
for code in sys.argv[1:]:
    try: d=json.load(open('' + __import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '..', 'web', 'src', 'lang') + '/%s.json'%code))
    except Exception as e: print(code,'INVALID JSON',e); ok=False; continue
    miss=[k for k in keys if k not in d]; bad=[]
    for k in keys:
        if k not in d: continue
        v=d[k]
        if not isinstance(v,str) or not v.strip(): bad.append((k,'empty')); continue
        if sorted(re.findall(r'\{[0-9abc]\}',k))!=sorted(re.findall(r'\{[0-9abc]\}',v)): bad.append((k,'placeholders: '+v))
        if v!=v.strip(): bad.append((k,'whitespace'))
        ek=re.findall(r'[\U0001F300-\U0001FAFF☀-➿■-◿⚡⚔🛡∞]',k); ev=re.findall(r'[\U0001F300-\U0001FAFF☀-➿■-◿⚡⚔🛡∞]',v)
        if sorted(ek)!=sorted(ev): bad.append((k,'emoji: '+v))
    extra=[k for k in d if k not in keys]
    print(code,'entries',len(d),'missing',len(miss),'bad',len(bad),'extra',len(extra))
    for b in bad[:12]: print('   ',b)
    for m in miss[:8]: print('    MISSING',repr(m))
    ok = ok and not miss and not bad
print('ALL GOOD' if ok else 'PROBLEMS')
