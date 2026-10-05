from pathlib import Path
import os,subprocess,time,json,sys,traceback,tempfile
BASE=Path(os.environ.get('AT_CHECK_DIR') or tempfile.mkdtemp(prefix='spot-at-check-'));BASE.mkdir(parents=True,exist_ok=True)
REPO=next(p for p in Path(__file__).resolve().parents if (p/'assets/pdfs').is_dir())
name=sys.argv[1] if len(sys.argv)>1 else 'notebook';filename={'notebook':'wang-what-makes-well-documented-chiea2021.pdf','code':'krosnick-promises-pitfalls-llms-chi2023compui.pdf','crosspage':'oney-firecrystal-vlhcc2009.pdf'}[name];page={'notebook':5,'code':2,'crosspage':1}[name]
runtime=BASE/(name+'-runtime');config=BASE/(name+'-config');profile=BASE/(name+'-profile')
for p in [runtime,config,profile]:p.mkdir(mode=0o700,exist_ok=True)
display=':'+str({'notebook':179,'code':180,'crosspage':181}[name])
os.environ.update({'DISPLAY':display,'XDG_RUNTIME_DIR':str(runtime),'XDG_CONFIG_HOME':str(config),'GNOME_ACCESSIBILITY':'1','MOZ_ENABLE_ACCESSIBILITY':'1','MOZ_CRASHREPORTER_DISABLE':'1','MOZ_NO_REMOTE':'1','GSETTINGS_BACKEND':'memory'})
(profile/'user.js').write_text('''user_pref("accessibility.force_disabled", 0);
user_pref("browser.newtabpage.enabled", false);
user_pref("browser.newtabpage.activity-stream.feeds.topsites", false);
user_pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
user_pref("browser.newtabpage.activity-stream.feeds.weatherfeed", false);
user_pref("browser.startup.homepage", "about:blank");
user_pref("browser.shell.checkDefaultBrowser", false);
user_pref("browser.aboutwelcome.enabled", false);
user_pref("browser.startup.homepage_override.mstone", "ignore");
user_pref("browser.startup.firstrunSkipsHomepage", true);
user_pref("browser.startup.page", 0);
user_pref("datareporting.policy.dataSubmissionEnabled", false);
user_pref("app.update.auto", false);
user_pref("pdfjs.disabled", false);
user_pref("pdfjs.enableAltText", true);
''')
procs=[]
try:
 xvlog=(BASE/(name+'-xvfb.log')).open('w');procs.append(subprocess.Popen(['Xvfb',display,'-screen','0','1500x1200x24','-nolisten','tcp'],stdout=xvlog,stderr=subprocess.STDOUT));time.sleep(1)
 import gi;gi.require_version('Atspi','2.0');from gi.repository import Atspi
 Atspi.init();Atspi.get_desktop(0)
 subprocess.run(['dbus-update-activation-environment','DISPLAY','XDG_RUNTIME_DIR','XDG_CONFIG_HOME','GSETTINGS_BACKEND'],check=False)
 if '--orca' in sys.argv:
  from orca_helpers import start;start(BASE,name,procs)
 flog=(BASE/(name+'-firefox.log')).open('w');procs.append(subprocess.Popen(['/snap/firefox/current/usr/lib/firefox/firefox','--no-remote','--profile',str(profile),'--new-window',(REPO/'assets/pdfs'/filename).as_uri()+'#page='+str(page)],stdout=flog,stderr=subprocess.STDOUT))
 time.sleep(9)
 (BASE/(name+'-versions.txt')).write_text(subprocess.check_output(['/snap/firefox/current/usr/lib/firefox/firefox','--version'],text=True,stderr=subprocess.STDOUT))
 def dump(a,depth=0):
  r={'role':a.get_role_name(),'name':a.get_name(),'states':[s.value_nick for s in a.get_state_set().get_states()]}
  try:
   t=a.get_text_iface()
   if t:r['text']=Atspi.Text.get_text(a,0,-1)
  except Exception as ex:r['text_error']=str(ex)
  try:
   tab=a.get_table_iface()
   if tab:r['table']={'rows':tab.get_n_rows(),'columns':tab.get_n_columns(),'row_descriptions':[tab.get_row_description(i)for i in range(tab.get_n_rows())],'column_descriptions':[tab.get_column_description(i)for i in range(tab.get_n_columns())]}
  except Exception as ex:r['table_error']=str(ex)
  try:
   if a.is_table_cell():
    tc=a.get_table_cell();r['cell_headers']={'columns':[x.get_name()for x in tc.get_column_header_cells()],'rows':[x.get_name()for x in tc.get_row_header_cells()]}
  except Exception as ex:r['cell_header_error']=str(ex)
  r['children']=[]
  if depth<60:
   for i in range(min(a.get_child_count(),1500)):
    try:r['children'].append(dump(a.get_child_at_index(i),depth+1))
    except Exception as ex:r['children'].append({'error':str(ex)})
  return r
 if '--orca' in sys.argv:
  def livewalk(n):
   yield n
   for i in range(n.get_child_count()):yield from livewalk(n.get_child_at_index(i))
  docs=[n for n in livewalk(Atspi.get_desktop(0)) if n.get_role_name()=='document web' and filename in n.get_name()]
  assert docs;Atspi.Component.grab_focus(docs[0]);time.sleep(.5)
  from orca_helpers import keys;keys();time.sleep(10)
 d=dump(Atspi.get_desktop(0));(BASE/(name+'-atspi.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
 def summary(n):
  if n.get('text') or n.get('name') or n.get('table'):print(n.get('role'),repr(n.get('name','')),repr(n.get('text',''))[:170],n.get('table',''))
  for c in n.get('children',[]):summary(c)
 print('Captured accessibility tree:',name,flush=True)
except Exception:
 traceback.print_exc();raise
finally:
 for p in reversed(procs):
  p.terminate()
 for p in reversed(procs):
  try:p.wait(timeout=5)
  except subprocess.TimeoutExpired:p.kill()
