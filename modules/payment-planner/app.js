const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fmt=n=>n.toLocaleString(undefined,{style:'currency',currency:'CAD'});
const sum=a=>a.reduce((x,y)=>x+(+y||0),0), num=v=>{const n=+v;return isFinite(n)?n:0;};

let months=[], scope=[], computeTimer=null, lastWeeksAlloc=[], lastWeekMap={}, lastProjWeeks=18;

/* Density */
$("#btnDensity").addEventListener("click",()=>{ document.body.classList.toggle("compact"); });

/* Share & Mobile & Owner */
function setMobile(force){ document.body.classList.toggle("force-mobile", force); prefs.mobile = !!force; savePrefs(); }
function setOwner(force){ document.body.classList.toggle("owner", force); prefs.owner = !!force; savePrefs(); }
$("#btnOwnerView").addEventListener("click",()=> setOwner(!document.body.classList.contains("owner")));
$("#btnOwnerPDF").addEventListener("click",()=> ownerPDF());
$("#btnShare").addEventListener("click",async()=>{
  try{ await navigator.clipboard.writeText(location.href); alert("Link copied to clipboard:\\n"+location.href); }
  catch(e){ alert("Could not copy link. Copy from the address bar."); }
});
$("#btnShareState").addEventListener("click",()=>{
  const state = captureState();
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  const url = location.origin + location.pathname + "#state="+encoded;
  navigator.clipboard.writeText(url).then(()=>alert("Scenario link copied!")).catch(()=>alert("Copy failed; URL in console."));
  console.log(url);
});
$("#btnMobileToggle").addEventListener("click",()=> setMobile(!document.body.classList.contains("force-mobile")) );

/* Persist key settings & toggles */
const prefs = { mobile:false, owner:false };
const persistKeys=["projectStart","projectWeeks","markupPct","hstPct","holdbackPct","depositPct","depositCreditPct","toggleHst","toggleDep","toggleHold","toggleMonthShade","toggleNotes"];
function savePrefs(){
  const o={...prefs};
  persistKeys.forEach(k=>{const el=$("#"+k); if(!el) return; o[k]=(el.type==="checkbox")? el.checked : el.value;});
  localStorage.setItem("pcfp_prefs", JSON.stringify(o));
}
function loadPrefs(){
  try{
    const o=JSON.parse(localStorage.getItem("pcfp_prefs")||"{}");
    persistKeys.forEach(k=>{ if(o[k]!==undefined){ const el=$("#"+k); if(!el) return; if(el.type==="checkbox") el.checked=!!o[k]; else el.value=o[k]; }});
    if(o.mobile) setMobile(true);
    if(o.owner) setOwner(true);
  }catch(e){}
}
persistKeys.forEach(k=>{const el=$("#"+k); if(el) el.addEventListener("change", ()=>{savePrefs(); scheduleCompute();});});
window.addEventListener("beforeunload", savePrefs);

/* Profiles Export/Import */
$("#btnExportProfiles").addEventListener("click",()=>{
  const keys=Object.keys(localStorage).filter(k=>k.startsWith("pcfp_profile_"));
  const payload={ exportedAt:new Date().toISOString(), profiles:{} };
  keys.forEach(k=>payload.profiles[k]=localStorage.getItem(k));
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="pcfp_profiles_export.json"; a.click();
});
$("#btnImportProfiles").addEventListener("click",()=>{
  const inp=document.createElement("input"); inp.type="file"; inp.accept=".json,application/json";
  inp.onchange=()=>{
    const f=inp.files[0]; const rd=new FileReader();
    rd.onload=()=>{
      try{
        const data=JSON.parse(rd.result);
        if(!data.profiles) throw new Error("No profiles key in JSON");
        Object.keys(data.profiles).forEach(k=>localStorage.setItem(k,data.profiles[k]));
        alert("Profiles imported."); refreshProfiles();
      }catch(e){ alert("Invalid profiles JSON"); }
    };
    rd.readAsText(f);
  };
  inp.click();
});

/* Calendar helpers */
function recalcMonthBounds(){let start=1;months.forEach(m=>{m.start=(m.index===1?1:start);m.end=m.start+Math.max(0,(m.weeks||0))-1;start=m.end+1;});}
function renderMonths(){
  const tb=$("#monthsTable tbody"); tb.innerHTML="";
  months.forEach((m,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${m.index}</td>
      <td><input type="text" value="${m.label}" data-i="${i}" data-k="label"></td>
      <td class="num"><input type="number" min="0" value="${m.weeks}" data-i="${i}" data-k="weeks"></td>
      <td class="num">${m.weeks?m.start:"—"}</td>
      <td class="num">${m.weeks?m.end:"—"}</td>
      <td class="num"><button class="ghost" onclick="removeMonth(${i})">Remove</button></td>`;
    tb.appendChild(tr);
  });
  tb.querySelectorAll("input").forEach(inp=>{
    inp.addEventListener("input",(e)=>{
      const i=+e.target.dataset.i,k=e.target.dataset.k;
      if(k==="weeks"){ months[i].weeks=Math.max(0,Math.floor(num(e.target.value))); recalcMonthBounds(); }
      else if(k==="label"){ months[i].label=e.target.value; }
      renderMonths(); scheduleCompute();
    });
  });
  const total=sum(months.map(m=>m.weeks||0));
  $("#totalWeeks").textContent=total.toFixed(0);
  const target=Math.max(1,Math.floor(num($("#projectWeeks").value))); const ok=total===target;
  $("#badgeWeeks").textContent = `Weeks: ${total}/${target}`;
  const badge=$("#weeksCheck"); badge.textContent= ok ? "OK" : "Adjust Weeks"; badge.className="badge-note"; badge.style.borderColor = ok?"var(--ok)":"var(--err)"; badge.style.color= ok?"var(--ok)":"var(--err)";
}

/* Months ops */
function addMonth(){const idx=months.length+1;months.push({index:idx,label:`Month ${idx}`,weeks:0});recalcMonthBounds();renderMonths();}
function removeMonth(i){months.splice(i,1);months.forEach((m,ix)=>m.index=ix+1);recalcMonthBounds();renderMonths();}
function resetMonths(){months=[{index:1,label:"Month 1",weeks:2},{index:2,label:"Month 2",weeks:4},{index:3,label:"Month 3",weeks:4},{index:4,label:"Month 4",weeks:4},{index:5,label:"Month 5",weeks:4}];recalcMonthBounds();renderMonths(); scheduleCompute();}
function autoMonths(){
  const startStr=$("#projectStart").value, weeks=Math.max(1,Math.floor(num($("#projectWeeks").value)));
  if(!startStr){ alert("Set a Project Start Date first."); return; }
  const start=new Date(startStr+"T00:00:00"); const buckets=[];
  for(let w=1; w<=weeks; w++){
    const d=new Date(start.getTime()+(w-1)*7*86400000);
    const label=d.toLocaleString(undefined,{month:"short",year:"numeric"});
    if(!buckets.length||buckets[buckets.length-1].label!==label) buckets.push({label, weeks:1});
    else buckets[buckets.length-1].weeks+=1;
  }
  months=buckets.map((b,i)=>({index:i+1,label:b.label,weeks:b.weeks}));
  recalcMonthBounds(); renderMonths(); savePrefs(); scheduleCompute();
}

/* Scope */
function rowHTML(s,i){
  return `<tr data-i="${i}" onclick="highlightTask(${i})">
      <td><input type="checkbox" class="selRow"></td>
      <td><input type="text" value="${s.code||""}" data-k="code"></td>
      <td><input type="text" value="${s.name||""}" data-k="name"></td>
      <td class="num"><input type="number" step="0.01" value="${s.base??0}" data-k="base"></td>
      <td class="num"><input type="number" min="1" value="${s.startwk??1}" data-k="startwk"></td>
      <td class="num"><input type="number" min="0" value="${s.dur??0}" data-k="dur"></td>
      <td style="white-space:nowrap"><label><input type="checkbox" ${s.spread?"checked":""} data-k="spread">Spread</label></td>
      <td class="num"><input type="number" step="0.01" value="${s.pdpct??0}" data-k="pdpct"></td>
      <td class="num"><input type="number" min="1" value="${s.pdweek??1}" data-k="pdweek"></td>
      <td class="notesCell" ${$("#toggleNotes")?.checked?"":"style='display:none'"}><textarea data-k="notes">${(s.notes||"")}</textarea></td>
      <td class="num" style="white-space:nowrap">
        <button class="ghost" onclick="duplicateRow(${i});event.stopPropagation()">Duplicate</button>
        <button class="ghost" onclick="removeScope(${i});event.stopPropagation()">Remove</button>
      </td>
    </tr>`;
}
function renderScope(){
  const tb=$("#scopeTable tbody"); tb.innerHTML="";
  const q=($("#scopeSearch").value||"").trim().toLowerCase();
  scope.forEach((s,i)=>{
    const txt=((s.code||"")+" "+(s.name||"")).toLowerCase();
    if(q && !txt.includes(q)) return;
    tb.insertAdjacentHTML("beforeend", rowHTML(s,i));
  });
  tb.querySelectorAll("input,textarea").forEach(inp=>{
    inp.addEventListener("input",(e)=>{
      const tr=e.target.closest("tr"); const i=+tr.dataset.i; const k=e.target.dataset.k;
      if(k==="spread"){ scope[i][k]=e.target.checked; if(scope[i][k]){ scope[i].startwk=1; scope[i].dur=Math.max(1,Math.floor(num($("#projectWeeks").value))); renderScope(); return; } }
      else if(["base","pdpct"].includes(k)){ scope[i][k]=num(e.target.value); }
      else if(["startwk","dur","pdweek"].includes(k)){ let v=Math.floor(num(e.target.value)); if(k!=="dur") v=Math.max(1,v); else v=Math.max(0,v); scope[i][k]=v; }
      else { scope[i][k]=e.target.value; }
      if(k==="pdpct" && num(e.target.value)>0 && (!scope[i].pdweek || scope[i].pdweek<1)) scope[i].pdweek=1;
      scheduleCompute();
    });
  });
  $("#selAll").onchange = (e)=>{ tb.querySelectorAll(".selRow").forEach(cb=>cb.checked=e.target.checked); };
  updateBadges();
}
function duplicateRow(i){ const copy=JSON.parse(JSON.stringify(scope[i])); scope.splice(i+1,0,copy); renderScope(); }
function addScopeRow(){scope.push({code:"",name:"",base:0,startwk:1,dur:0,spread:false,pdpct:0,pdweek:1,notes:""});renderScope();}
function addNRows(){const n = Math.max(1, Math.floor(num(prompt("How many rows to add?", "5")))); for(let i=0;i<n;i++) addScopeRow();}
function deleteSelected(){const tb=$("#scopeTable tbody"); const toDel=[...tb.querySelectorAll("tr")].filter(tr=>tr.querySelector(".selRow")?.checked).map(tr=>+tr.dataset.i); if(!toDel.length) return; scope=scope.filter((_,i)=>!toDel.includes(i)); renderScope();}
function removeScope(i){scope.splice(i,1);renderScope();}
function clearScope(){scope=[];renderScope();}
$("#toggleNotes").addEventListener("change",()=>{ $$("#scopeTable .notesCell").forEach(td=>td.style.display=$("#toggleNotes").checked?"":"none"); });

/* Profiles */
function refreshProfiles(){const sel=$("#profiles"); if(!sel) return; sel.innerHTML=""; Object.keys(localStorage).filter(k=>k.startsWith("pcfp_profile_")).sort().forEach(k=>{const o=document.createElement("option");o.value=k;o.textContent=k.replace("pcfp_profile_","");sel.appendChild(o);});}
function captureState(){return{schema:"pcfp-1.0",settings:{projectStart:$("#projectStart").value||null,projectWeeks:num($("#projectWeeks").value),markupPct:num($("#markupPct").value),hstPct:num($("#hstPct").value),holdbackPct:num($("#holdbackPct").value),depositPct:num($("#depositPct").value),depositCreditPct:num($("#depositCreditPct").value)},months,scope,toggles:{hst:$("#toggleHst").checked,dep:$("#toggleDep").checked,hold:$("#toggleHold").checked,shade:$("#toggleMonthShade").checked,mobile:document.body.classList.contains("force-mobile"),owner:document.body.classList.contains("owner"),notes:$("#toggleNotes").checked}};}
function applyState(d){
  if(d.settings){$("#projectStart").value=d.settings.projectStart||"";$("#projectWeeks").value=d.settings.projectWeeks??18;$("#markupPct").value=d.settings.markupPct??0.20;$("#hstPct").value=d.settings.hstPct??0.13;$("#holdbackPct").value=d.settings.holdbackPct??0.10;$("#depositPct").value=d.settings.depositPct??0.30;$("#depositCreditPct").value=d.settings.depositCreditPct??0.20;}
  months=d.months??months; recalcMonthBounds(); renderMonths();
  scope=d.scope??scope; renderScope();
  if(d.toggles){ $("#toggleHst").checked=!!d.toggles.hst; $("#toggleDep").checked=!!d.toggles.dep; $("#toggleHold").checked=!!d.toggles.hold; $("#toggleMonthShade").checked=!!d.toggles.shade; setMobile(!!d.toggles.mobile); setOwner(!!d.toggles.owner); $("#toggleNotes").checked=!!d.toggles.notes; $$("#scopeTable .notesCell").forEach(td=>td.style.display=$("#toggleNotes").checked?"":"none"); }
  applyToggles(); scheduleCompute();
}
function saveProfile(){const name=prompt("Profile name:"); if(!name) return; localStorage.setItem("pcfp_profile_"+name, JSON.stringify(captureState())); refreshProfiles();}
function loadProfile(){const sel=$("#profiles"); if(!sel.value){alert("No profiles saved."); return;} applyState(JSON.parse(localStorage.getItem(sel.value)));}
function renameProfile(){const sel=$("#profiles"); if(!sel.value) return; const newName=prompt("New name:", sel.options[sel.selectedIndex].text); if(!newName) return; const val=localStorage.getItem(sel.value); localStorage.setItem("pcfp_profile_"+newName, val); localStorage.removeItem(sel.value); refreshProfiles();}
function duplicateProfile(){const sel=$("#profiles"); if(!sel.value) return; const newName=prompt("Duplicate as:", sel.options[sel.selectedIndex].text+" Copy"); if(!newName) return; const val=localStorage.getItem(sel.value); localStorage.setItem("pcfp_profile_"+newName, val); refreshProfiles();}
function deleteProfile(){const sel=$("#profiles"); if(!sel.value) return; if(confirm("Delete profile '"+sel.options[sel.selectedIndex].text+"'?")){localStorage.removeItem(sel.value);refreshProfiles();}}

/* JSON Save/Load & URL import */
function saveJSON(){const blob=new Blob([JSON.stringify(captureState(),null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="payment_planner_v5.json"; a.click();}
function loadJSON(){const inp=document.createElement("input"); inp.type="file"; inp.accept=".json,application/json"; inp.onchange=()=>{const f=inp.files[0]; const rd=new FileReader(); rd.onload=()=>{try{applyState(JSON.parse(rd.result));}catch(e){alert('Invalid JSON');}}; rd.readAsText(f);}; inp.click();}
function importFromURL(){ if(location.hash.startsWith("#state=")){ try{ const enc=location.hash.slice(7); const obj=JSON.parse(decodeURIComponent(escape(atob(enc)))); applyState(obj); }catch(e){ console.warn("Invalid state in URL"); } }}

/* Toggles */
function applyToggles(){const sh=$("#toggleHst").checked, sd=$("#toggleDep").checked, shd=$("#toggleHold").checked; $$('.col-hst').forEach(el=>el.style.display=sh?'':'none'); $$('.col-dep').forEach(el=>el.style.display=sd?'':'none'); $$('.col-hold').forEach(el=>el.style.display=shd?'':'none'); savePrefs();}
$("#toggleHst").addEventListener("change",applyToggles); $("#toggleDep").addEventListener("change",applyToggles); $("#toggleHold").addEventListener("change",applyToggles);
$("#toggleMonthShade").addEventListener("change",()=>{savePrefs(); renderGantt();});

/* Debounced compute */
function scheduleCompute(){ clearTimeout(computeTimer); computeTimer = setTimeout(compute, 120); }

/* Badges */
function updateBadges(){
  const projWeeks=Math.max(1,Math.floor(num($("#projectWeeks").value)));
  let over=0, missing=0;
  scope.forEach(s=>{
    if(!(num(s.base)>0)) missing++;
    const end = s.spread ? projWeeks : (Math.max(1,num(s.startwk||1)) + Math.max(0,num(s.dur||0)) - 1);
    if(end>projWeeks) over++;
  });
  $("#badgeOverrun").textContent = `Overruns: ${over}`;
  $("#badgeInvalidBase").textContent = `Missing base: ${missing}`;
}

/* Compute */
function compute(){
  updateBadges();
  const projWeeks=Math.max(1,Math.floor(num($("#projectWeeks").value)));
  lastProjWeeks = projWeeks;
  const markup=num($("#markupPct").value), hst=num($("#hstPct").value), hold=num($("#holdbackPct").value), depPct=num($("#depositPct").value), depCred=num($("#depositCreditPct").value);
  const ms=months.filter(m=>m.weeks>0), totWeeks=sum(ms.map(m=>m.weeks));
  if(totWeeks!==projWeeks){
    if(!confirm("Months total "+totWeeks+" weeks but Project is "+projWeeks+" weeks. Proceed anyway?")) return;
  }
  let overrunItems=[];
  scope.forEach((s,idx)=>{
    const st=Math.max(1,Math.floor(num(s.startwk||1)));
    const du=Math.max(0,Math.floor(num(s.dur||0)));
    const en = s.spread ? projWeeks : (st + Math.max(0,du) - 1);
    if(en>projWeeks) overrunItems.push({idx,code:s.code,name:s.name,from:st,to:en});
  });
  if(overrunItems.length){
    const ok=confirm("Some items extend past the project end and will be auto-capped to W"+projWeeks+". Proceed?");
    if(!ok) return;
    overrunItems.forEach(it=>{
      const s=scope[it.idx]; if(s.spread){ s.startwk=1; s.dur=projWeeks; }
      else { const st=Math.max(1,Math.floor(num(s.startwk||1))); s.dur=Math.max(0, projWeeks - st + 1); }
    });
    renderScope();
    const note=$("#capNote"); note.textContent = `${overrunItems.length} item(s) were capped to Week ${projWeeks}.`; note.style.display="inline-block";
  } else {
    $("#capNote").style.display="none";
  }

  const baseTotal=sum(scope.map(s=>num(s.base))), withMarkup=baseTotal*(1+markup), depositPre=withMarkup*depPct, depositFloor=withMarkup*hold;
  $("#sumBase").textContent=baseTotal.toFixed(2); $("#sumMarkup").textContent=(withMarkup-baseTotal).toFixed(2); $("#sumContract").textContent=withMarkup.toFixed(2);

  const wk2m={}; ms.forEach((m,ix)=>{ for(let w=m.start; w<=m.end; w++) wk2m[w]=ix; });
  lastWeekMap = wk2m;
  const weeksAlloc=Array.from({length:projWeeks},()=>0);
  scope.forEach((s,idx)=>{
    const amt= num(s.base)*(1+markup), pdPct=num(s.pdpct||0);
    let pdWeek=Math.max(1,Math.floor(num(s.pdweek||1))); if(pdPct>0 && (!pdWeek || pdWeek<1)) pdWeek=1;
    const hasPD=pdPct>0; const pdAmt= hasPD? amt*pdPct : 0, rem=amt-pdAmt;
    let st,du,en; if(s.spread){ st=1; du=projWeeks; en=projWeeks; } else { st=Math.max(1,Math.floor(num(s.startwk||1))); du=Math.max(0,Math.floor(num(s.dur||0))); en=Math.min(projWeeks, st+Math.max(0,du)-1); }
    const denom=Math.max(1,(en-st+1));
    for(let w=st; w<=en; w++){ weeksAlloc[w-1]+= rem*(1/denom); }
    if(hasPD){ weeksAlloc[Math.min(projWeeks,Math.max(1,pdWeek))-1]+=pdAmt; }
  });
  const targetTotal = withMarkup; const allocSum = sum(weeksAlloc);
  const drift = Math.round((targetTotal - allocSum)*100)/100;
  if(Math.abs(drift)>=0.01){ for(let i=weeksAlloc.length-1;i>=0;i--){ if(weeksAlloc[i]>0){ weeksAlloc[i]+=drift; break; } } }
  lastWeeksAlloc = weeksAlloc.slice();

  const allocByMonth=ms.map(m=>({label:m.label,pretax:0, weeks:[] }));
  weeksAlloc.forEach((v,i)=>{const wk=i+1,mi=wk2m[wk]; if(mi!=null){ allocByMonth[mi].pretax+=v; allocByMonth[mi].weeks.push([wk,v]); }});
  const tb=$("#cashTable tbody"); tb.innerHTML=""; let depRemain=depositPre, tPre=0,tCred=0,tHold=0,tSub=0,tHst=0,tDue=0; let nearingFloor=false;
  allocByMonth.forEach((row,mi)=>{
    const pre=row.pretax, maxCred=Math.max(0,depRemain-depositFloor), desired= num($("#toggleDep").checked ? $("#depositCreditPct").value : 0) * pre, applied=Math.min(maxCred,desired); depRemain-=applied;
    const holdW= num($("#toggleHold").checked ? $("#holdbackPct").value : 0) * pre, sub=pre-applied-holdW, h=num($("#toggleHst").checked ? $("#hstPct").value : 0)*sub, due=sub+h;
    tPre+=pre; tCred+=applied; tHold+=holdW; tSub+=sub; tHst+=h; tDue+=due;
    const tr=document.createElement("tr");
    tr.innerHTML=`<td><a href="#" onclick="openMonth(${mi});return false;">${row.label}</a></td><td class="num">${fmt(pre)}</td><td class="num col-dep owner-hide">${fmt(applied)}</td><td class="num col-hold owner-hide">${fmt(holdW)}</td><td class="num">${fmt(sub)}</td><td class="num col-hst owner-hide">${fmt(h)}</td><td class="num">${fmt(due)}</td><td class="num owner-hide">${fmt(depRemain)}</td>`;
    tb.appendChild(tr);
    if(maxCred>0 && (maxCred - desired) < pre*0.1) nearingFloor = true;
  });
  const rel=tHold, relH= num($("#toggleHst").checked ? $("#hstPct").value : 0) * rel, relDue=rel+relH;
  const tr=document.createElement("tr");
  tr.innerHTML=`<td><strong>Holdback Release (Month +2)</strong></td><td class="num">${fmt(rel)}</td><td class="num col-dep owner-hide">$0.00</td><td class="num col-hold owner-hide"><strong>−${fmt(rel)}</strong></td><td class="num">${fmt(rel)}</td><td class="num col-hst owner-hide">${fmt(relH)}</td><td class="num"><strong>${fmt(relDue)}</strong></td><td class="num owner-hide"></td>`;
  tb.appendChild(tr);
  $("#tPre").textContent=fmt(tPre+rel); $("#tCred").textContent=fmt(tCred); $("#tHold").textContent=fmt(tHold-rel); $("#tSub").textContent=fmt(tSub+rel); $("#tHst").textContent=fmt(tHst+relH); $("#tDue").textContent=fmt(tDue+relDue);

  const used = depositPre - Math.max(0, depositFloor); const pct = depositPre>0 ? Math.max(0, Math.min(100, (used/depositPre)*100 )) : 0;
  document.getElementById("depTrack").style.width = pct+"%";
  document.getElementById("depositWarn").style.display = nearingFloor ? "" : "none";

  applyToggles();
  renderGantt();
}

/* Weekly drilldown modal */
function openMonth(mi){
  const row = months.filter(m=>m.weeks>0)[mi]; if(!row) return;
  const ms=months.filter(m=>m.weeks>0); const map={}; ms.forEach((m,ix)=>{ for(let w=m.start; w<=m.end; w++) map[w]=ix; });
  const items=[];
  lastWeeksAlloc.forEach((v,i)=>{ const wk=i+1; if(map[wk]===mi && v>0){ items.push([wk,v]); } });
  let html = `<div><strong>${row.label}</strong></div><table class='table' style='width:100%;border-collapse:collapse;margin-top:8px'><thead><tr><th>Week</th><th class='num'>Amount</th></tr></thead><tbody>`;
  items.forEach(([wk,v])=>{ html += `<tr><td>W${wk}</td><td class='num'>${fmt(v)}</td></tr>`; });
  html += `</tbody></table>`;
  $("#modalTitle").textContent = "Weekly Breakdown";
  $("#modalContent").innerHTML = html;
  $("#modal").style.display = "flex";
}
function closeModal(){ $("#modal").style.display = "none"; }

/* Gantt + highlight */
function highlightTask(i){ $$("#ganttTasks .task-row").forEach((r,ix)=>{ r.classList.toggle("active", ix===i); }); }
function renderGantt(){
  const projWeeks=Math.max(1,Math.floor(num($("#projectWeeks").value)));
  const startStr=$("#projectStart").value; const cal=!!startStr; const start=cal?new Date(startStr+"T00:00:00"):null;
  const shade=$("#toggleMonthShade").checked;

  const yearRow=$("#yearRow"), monthRow=$("#monthRow"), weekRow=$("#weekRow");
  [yearRow,monthRow,weekRow].forEach(r=>{r.style.gridTemplateColumns=`repeat(${projWeeks}, minmax(24px,1fr))`; r.innerHTML="";});
  const spansYear=[], spansMonth=[], weekTips=[];
  for(let w=1; w<=projWeeks; w++){
    let yLabel="—", mLabel="—", tip="";
    if(cal){
      const d0=new Date(start.getTime()+(w-1)*7*86400000);
      const d1=new Date(start.getTime()+(w-1)*7*86400000 + 6*86400000);
      yLabel=String(d0.getFullYear());
      mLabel=d0.toLocaleString(undefined,{month:"short"});
      tip = `${d0.toLocaleDateString(undefined,{month:'short',day:'numeric'})} – ${d1.toLocaleDateString(undefined,{month:'short',day:'numeric'})}, ${d1.getFullYear()}`;
    }
    spansYear.push(yLabel); spansMonth.push(mLabel); weekTips.push(tip||("Week "+w));
  }
  function buildSpans(values, container, getTip){
    let i=0;
    while(i<values.length){
      const val=values[i]; let j=i+1;
      while(j<values.length && values[j]===val) j++;
      const spanLen=(j-i);
      const pill=document.createElement("div"); pill.className="pill"; pill.textContent=val;
      if(getTip){ pill.title = getTip(i,j-1,val); }
      pill.style.gridColumn = `${i+1} / span ${spanLen}`;
      container.appendChild(pill);
      if(container===monthRow && shade && val!=="—"){
        const shadeDiv=document.createElement("div"); shadeDiv.className="month-shade";
        shadeDiv.style.left = `calc((100% / ${projWeeks}) * ${i})`; 
        shadeDiv.style.width= `calc((100% / ${projWeeks}) * ${spanLen})`;
        container.appendChild(shadeDiv);
      }
      i=j;
    }
  }
  buildSpans(spansYear, yearRow, (i,j,val)=> val==="—"?"":`Year ${val}`);
  buildSpans(spansMonth, monthRow, (i,j,val)=>{
    if(!cal||val==="—") return "";
    const d0=new Date(start.getTime()+(i)*7*86400000);
    const d1=new Date(start.getTime()+(j)*7*86400000 + 6*86400000);
    return `${val} ${d0.getFullYear()}: ${d0.toLocaleDateString(undefined,{month:'short',day:'numeric'})} – ${d1.toLocaleDateString(undefined,{month:'short',day:'numeric'})}`;
  });
  for(let w=1; w<=projWeeks; w++){
    const p=document.createElement("div"); p.className="pill"; p.textContent="W"+w; p.style.gridColumn=`${w} / span 1`; if(cal) p.title=weekTips[w-1]; weekRow.appendChild(p);
  }

  const tasks=$("#ganttTasks"); tasks.innerHTML="";
  scope.forEach((s,ix)=>{
    const row=document.createElement("div"); row.className="task-row"; row.onclick=()=>{ const tr=$(`#scopeTable tbody tr[data-i="${ix}"]`); tr?.scrollIntoView({behavior:"smooth",block:"center"}); highlightTask(ix); };
    const left=document.createElement("div"); left.className="gantt-left"; left.innerHTML=`<strong>${s.code||"(code)"}:</strong> ${s.name||""}`;
    const right=document.createElement("div"); right.className="task-bargrid"; right.style.gridTemplateColumns=`repeat(${projWeeks}, minmax(24px,1fr))`;
    let st,du,en; if(s.spread){ st=1; du=projWeeks; en=projWeeks; } else { st=Math.max(1,Math.floor(num(s.startwk||1))); du=Math.max(0,Math.floor(num(s.dur||0))); en=Math.min(projWeeks, st+Math.max(0,du)-1); }
    for(let w=1; w<=projWeeks; w++){ const c=document.createElement("div"); c.className="task-cell"; if(w>=st&&w<=en&&du>0) c.classList.add("fill"); right.appendChild(c); }
    row.appendChild(left); row.appendChild(right); tasks.appendChild(row);
  });

  const leg=$("#ganttLegend");
  if(cal){ const wk1=start.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}); const wkN=new Date(start.getTime()+(projWeeks-1)*7*86400000).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}); leg.textContent=`Calendar span: ${wk1} → ${wkN} (${projWeeks} weeks)`; } else { leg.textContent="No start date set (white-label weeks)"; }
}

/* Exports */
function tableToHTML(){const tbl=$("#cashTable").cloneNode(true); if(!$("#toggleHst").checked){tbl.querySelectorAll(".col-hst").forEach(el=>el.remove());} if(!$("#toggleDep").checked){tbl.querySelectorAll(".col-dep").forEach(el=>el.remove());} if(!$("#toggleHold").checked){tbl.querySelectorAll(".col-hold").forEach(el=>el.remove());} return "<html><head><meta charset='utf-8'></head><body>"+tbl.outerHTML+"</body></html>";}
function exportExcel(){const html=tableToHTML(); const blob=new Blob([html],{type:"application/vnd.ms-excel"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="cashflow_v5.xls"; a.click();}
function downloadCSV(){const rows=[["Month","PreTax_Work","Deposit_Credit","Holdback","Subtotal_After_Credits","HST","Amount_Due_Now","Deposit_Remaining"]]; $$("#cashTable tbody tr").forEach(tr=>{rows.push([...tr.children].map(td=>td.innerText.replace(/[$,]/g,"")));}); const csv=rows.map(r=>r.join(",")).join("\\n"); const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="cashflow_v5.csv"; a.click();}
function exportScope(){const rows=[["Code","Name","Base","StartWeek","Duration","Spread","ProcDepositPct","ProcBillWeek","Notes"]]; scope.forEach(s=>{rows.push([s.code||"",s.name||"",num(s.base),num(s.startwk||1),num(s.dur||0),s.spread?1:0,num(s.pdpct||0),num(s.pdweek||1),(s.notes||"").replace(/[\\r\\n,]+/g," ")]);}); const csv=rows.map(r=>r.join(",")).join("\\n"); const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="scope_v5.csv"; a.click();}

/* Owner PDF (SVG, scaled up) */
function ownerPDF(){
  const cash=$("#cashTable").cloneNode(true);
  cash.querySelectorAll(".owner-hide").forEach(el=>el.remove());
  const projWeeks=Math.max(1,Math.floor(num($("#projectWeeks").value)));
  const startStr=$("#projectStart").value;
  const cellW=26, cellH=16, leftW=260, rowGap=6, topHdr=74, pad=40;
  const active = scope.filter(s=> (num(s.base)>0) || s.spread || num(s.dur)>0 );
  const height = topHdr + active.length*(cellH+rowGap) + pad;
  const width = leftW + projWeeks*(cellW+6) + pad;

  function esc(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
  const startDate = startStr? new Date(startStr+"T00:00:00") : null;
  function monthSpans(){
    if(!startDate) return [];
    const spans=[]; let cur=null;
    for(let w=1; w<=projWeeks; w++){
      const d=new Date(startDate.getTime()+(w-1)*7*86400000);
      const key=d.getFullYear()+"-"+d.getMonth();
      if(!cur || cur.key!==key){ if(cur) spans.push(cur); cur={key,start:w,label:d.toLocaleString(undefined,{month:"short"}),year:d.getFullYear()}; }
      cur.end=w;
    }
    if(cur) spans.push(cur); return spans;
  }
  const mspans = monthSpans();
  let svg = [];
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="12">`);
  svg.push(`<defs><linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(212,175,55,0.7)"/><stop offset="1" stop-color="rgba(184,134,11,0.65)"/></linearGradient></defs>`);
  svg.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#fff" />`);
  svg.push(`<text x="${leftW}" y="20" fill="#111" font-weight="700">Timeline (Weekly Gantt)</text>`);
  if(startDate){
    let lastYear=null, spanStart=1;
    for(let w=1; w<=projWeeks; w++){
      const d=new Date(startDate.getTime()+(w-1)*7*86400000);
      const y=d.getFullYear();
      if(lastYear===null){ lastYear=y; spanStart=1; }
      if(y!==lastYear || w===projWeeks){
        const spanEnd=(y!==lastYear)? (w-1) : w;
        const x=leftW + (spanStart-1)*(cellW+6);
        const wpx=(spanEnd-spanStart+1)*(cellW+6)-6;
        svg.push(`<rect x="${x}" y="30" width="${wpx}" height="22" rx="11" fill="#f3f4f6" stroke="#e5e7eb"/>`);
        svg.push(`<text x="${x+wpx/2}" y="45" text-anchor="middle" fill="#374151">${lastYear}</text>`);
        lastYear=y; spanStart=w;
      }
    }
    mspans.forEach(m=>{
      const x=leftW + (m.start-1)*(cellW+6);
      const wpx=(m.end-m.start+1)*(cellW+6)-6;
      svg.push(`<rect x="${x}" y="54" width="${wpx}" height="20" rx="10" fill="#f3f4f6" stroke="#e5e7eb"/>`);
      svg.push(`<text x="${x+wpx/2}" y="68" text-anchor="middle" fill="#374151">${esc(m.label)}</text>`);
    });
  }
  for(let w=1; w<=projWeeks; w++){
    const x=leftW + (w-1)*(cellW+6);
    svg.push(`<rect x="${x}" y="${topHdr-22}" width="${cellW}" height="20" rx="10" fill="#f3f4f6" stroke="#e5e7eb"/>`);
    svg.push(`<text x="${x+cellW/2}" y="${topHdr-7}" text-anchor="middle" fill="#6b7280">W${w}</text>`);
  }
  let y=topHdr;
  active.forEach(s=>{
    svg.push(`<text x="10" y="${y+cellH-2}" fill="#111"><tspan font-weight="700">${esc(s.code||"")}</tspan>: ${esc(s.name||"")}</text>`);
    let st,du,en; if(s.spread){ st=1; du=projWeeks; en=projWeeks; } else { st=Math.max(1,Math.floor(num(s.startwk||1))); du=Math.max(0,Math.floor(num(s.dur||0))); en=Math.min(projWeeks, st+Math.max(0,du)-1); }
    if(du>0){ const x=leftW + (st-1)*(cellW+6); const wpx=(en-st+1)*(cellW+6)-6; svg.push(`<rect x="${x}" y="${y}" width="${wpx}" height="${cellH}" rx="8" fill="url(#bar)" stroke="#e5e7eb"/>`); }
    y+=cellH+rowGap;
  });
  svg.push(`</svg>`);
  const svgStr=svg.join("");

  const win=window.open("","_blank");
  const style = document.createElement("style");
  style.textContent = `body{{font:14px Inter, system-ui;margin:18px;color:#111}} h1{{font-size:20px}} table{{width:100%;border-collapse:collapse}} th,td{{border:1px solid #ddd;padding:8px 10px;text-align:left}} th{{background:#f6f6f6}}`;
  win.document.head.appendChild(style);
  win.document.body.innerHTML = `<h1>Cash Flow Statement</h1>` + cash.outerHTML + `<h1 style="margin-top:18px">Timeline (Weekly Gantt)</h1>` + svgStr;
  setTimeout(()=>win.print(), 300);
}

/* Init: preload 2x2 codes then load sample */
function preloadCodes(){
  const codes=[
    ["0010","General Contracting"],["0020","Accounting"],["0030","Administration"],["0040","Fines & Fees"],
    ["0100","Design"],["0110","Engineering"],["0120","Other Consulting"],
    ["0200","Site Lead & Management"],["0220","General Labour & Handyman"],["0240","Supplies & Materials"],["0260","Safety & Remediation"],
    ["1000","Site Mobilization"],["1100","Demolition & Disposal"],["1200","Water & Drain Service"],
    ["2000","Excavation"],["2100","Footing & Foundation"],["2200","Concrete Flatwork"],["2300","Structural Steel"],["2400","Framing"],
    ["3000","HVAC"],["3200","Plumbing"],["3400","Electrical"],
    ["4000","Roofing & Exterior Trim"],["4200","Facade"],["4400","Windows & Doors"],["4600","Insulation"],
    ["5000","Drywall"],["5200","Interior Trim"],["5400","Painting & Staining"],["5500","Millwork"],["5600","Flooring"],["5700","Tile"],
    ["5800","Stairs, Railings & Guardrails"],["5900","Finishes & Accessories"],["6000","Clean-up"],["6100","Landscaping"]
  ];
  scope = codes.map(([code,name])=>({code,name,base:0,startwk:1,dur:0,spread:false,pdpct:0,pdweek:1,notes:""}));
  renderScope();
}

/* Sample profile */
const SAMPLE_PROFILE_KEY="pcfp_profile_Sample_Project";
function buildSampleProfile(){
  const settings={projectStart:null,projectWeeks:18,markupPct:0.20,hstPct:0.13,holdbackPct:0.10,depositPct:0.30,depositCreditPct:0.20};
  const months=[{index:1,label:"Month 1",weeks:2},{index:2,label:"Month 2",weeks:4},{index:3,label:"Month 3",weeks:4},{index:4,label:"Month 4",weeks:4},{index:5,label:"Month 5",weeks:4}];
  const codes=[
    ["0200","Site Lead & Management",30000,1,18,true,0,1,"Spread across project"],
    ["0220","General Labour & Handyman",8000,1,18,true,0,1,"As-needed labor"],
    ["0240","Supplies & Materials",6000,1,18,true,0,1,"Consumables"],
    ["1000","Site Mobilization",4000,1,2,false,0,1,"Setup"],
    ["1100","Demolition & Disposal",9000,1,2,false,0,1,""],
    ["2000","Excavation",12000,3,2,false,0,1,""],
    ["2100","Footing & Foundation",18000,4,3,false,0,1,"Includes local piles"],
    ["2400","Framing",28000,7,3,false,0,1,""],
    ["3000","HVAC",12000,9,3,false,0.15,1,"Equipment deposit"],
    ["3200","Plumbing",14000,9,3,false,0.15,1,"Rough-in"],
    ["3400","Electrical",16000,9,3,false,0.15,1,"Rough-in"],
    ["4400","Windows & Doors",20000,11,2,false,0.50,1,"50% deposit pre-con, 50% at install"],
    ["4600","Insulation",7000,12,1,false,0,1,""],
    ["5000","Drywall",15000,13,2,false,0,1,""],
    ["5200","Interior Trim",9000,15,2,false,0.20,1,"Millwork deposits"],
    ["5400","Painting & Staining",6000,16,2,false,0,1,""],
    ["5600","Flooring",10000,16,2,false,0.20,1,"Material deposit"],
    ["6000","Clean-up",3000,18,1,false,0,1,"Final cleanup"]
  ];
  const scope=codes.map(([code,name,base,startwk,dur,spread,pdpct,pdweek,notes])=>({code,name,base,startwk,dur,spread,pdpct,pdweek,notes}));
  return {schema:"pcfp-1.0",settings,months,scope,toggles:{hst:true,dep:true,hold:true,shade:true,mobile:false,owner:false,notes:false}};
}
function ensureSampleProfile(){ if(!localStorage.getItem(SAMPLE_PROFILE_KEY)){ localStorage.setItem(SAMPLE_PROFILE_KEY, JSON.stringify(buildSampleProfile())); } }
function loadSample(){ const val=localStorage.getItem(SAMPLE_PROFILE_KEY); if(!val){ alert("Sample profile missing."); return;} applyState(JSON.parse(val)); }
$("#btnLoadSample").addEventListener("click", loadSample);

/* Boot */
function boot(){
  loadPrefs();
  ensureSampleProfile();
  refreshProfiles();
  if(!months.length){ resetMonths(); renderMonths(); }
  if(!scope.length){ preloadCodes(); }
  importFromURL();
  applyToggles();
  scheduleCompute();
  $("#scopeSearch").addEventListener("input", renderScope);
}
boot();

// === v5.1 additive JS (safe, no overrides) ===
(function(){
  const $ = (s,r=document)=>r.querySelector(s);
  const $$= (s,r=document)=>Array.from(r.querySelectorAll(s));
  const num=v=>{const n=+v;return Number.isFinite(n)?n:0;};

  // 3-dot menu
  let menuEl=null;
  function closeMenu(){ if(menuEl){ menuEl.remove(); menuEl=null; document.removeEventListener('click',onDoc);} }
  function onDoc(e){ if(menuEl && !menuEl.contains(e.target)) closeMenu(); }
  function openRowMenu(ev,i){
    closeMenu();
    const rect=ev.currentTarget.getBoundingClientRect();
    const m=document.createElement('div');
    m.className='pcfp-menu';
    m.innerHTML=[
      `<button type="button" onclick="duplicateRow(${i});">📄 Duplicate</button>`,
      `<button type="button" onclick="removeScope(${i});">🗑️ Remove</button>`,
      `<button type="button" onclick="window.__wkBreak && window.__wkBreak(${i});">🔢 Week Breakdown</button>`,
      `<button type="button" onclick="window.__focusNotes && window.__focusNotes(${i});">📝 Note…</button>`
    ].join('');
    document.body.appendChild(m); menuEl=m;
    m.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    m.style.left= Math.max(12, rect.right + window.scrollX - 180) + 'px';
    setTimeout(()=>document.addEventListener('click', onDoc));
  }
  function ensureRowMenus(){
    const rows = $$('#scopeTable tbody tr');
    rows.forEach(tr=>{
      const i = +tr.dataset.i || 0;
      const cell = tr.lastElementChild;
      if(!cell || cell.querySelector('.pcfp-menu-btn')) return;
      const b=document.createElement('button');
      b.type='button'; b.textContent='⋯'; b.className='pcfp-menu-btn';
      b.addEventListener('click', e=>{ e.stopPropagation(); openRowMenu(e,i); });
      cell.style.textAlign='right'; cell.appendChild(b);
    });
  }
  window.__focusNotes = window.__focusNotes || function(i){
    const tr=document.querySelector(`#scopeTable tbody tr[data-i="${i}"]`);
    const ta=tr && tr.querySelector('textarea[data-k="notes"]'); if(ta) ta.focus();
  };
  window.__wkBreak = window.__wkBreak || function(i){
    const projWeeks = Math.max(1, Math.floor(num($('#projectWeeks')?.value||0)));
    const s = window.scope && window.scope[i];
    if(!projWeeks || !s) return alert('No weeks or scope row.');
    const spread = !!s.spread;
    const start = spread?1:Math.max(1,Math.floor(num(s.startwk||1)));
    const dur   = spread?projWeeks:Math.max(0,Math.floor(num(s.dur||0)));
    const end   = spread?projWeeks:Math.min(projWeeks, start+Math.max(0,dur)-1);
    const arr=[]; for(let w=1; w<=projWeeks; w++) arr.push((w>=start&&w<=end)?1:0);
    const win=window.open('','_blank'); win.document.write(`<h3>${s.code||''} ${s.name||''}</h3><pre>`+JSON.stringify(arr,null,2)+`</pre>`); win.document.close();
  };

  // Owner PDF
  function bindOwnerPDF(){
    let btn = Array.from(document.querySelectorAll('button')).find(b=>/owner pdf/i.test(b.textContent||''));
    if(!btn) return;
    btn.addEventListener('click', (e)=>{ e.preventDefault(); ownerPDF(); });
  }
  function ownerPDF(){
    const cash = $('#cashTable')?.cloneNode(true);
    if(!cash) return alert('Cash table not found');
    cash.querySelectorAll('.owner-hide').forEach(el=>el.remove());
    const gantt = $('#gantt, .gantt, #ganttGrid')?.cloneNode(true) || document.createElement('div');
    const w = window.open('','_blank');
    const style = document.createElement('style');
    style.textContent = 'body{font:14px Inter, system-ui;margin:18px;color:#111} h1{font-size:20px;margin:12px 0} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px 10px;text-align:left} th{background:#f6f6f6}';
    w.document.head.appendChild(style);
    const h1a = w.document.createElement('h1'); h1a.textContent='Cash Flow Statement';
    const h1b = w.document.createElement('h1'); h1b.textContent='Timeline (Weekly Gantt)'; h1b.style.marginTop='18px';
    w.document.body.appendChild(h1a); w.document.body.appendChild(cash); w.document.body.appendChild(h1b); w.document.body.appendChild(gantt);
    setTimeout(()=>w.print(), 300);
  }

  // Auto Gantt left width
  function autoGanttLeftWidth(){
    try{
      const grid = document.querySelector('.gantt-grid');
      const rows = $$('#ganttTasks .task-row');
      if(!grid || !rows.length) return;
      const labels = $$('#ganttTasks .task-row .label').map(el=>el.textContent.trim());
      const canvas=document.createElement('canvas');
      const ctx=canvas.getContext('2d'); ctx.font='14px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial';
      let max=240; labels.forEach(l=>{ const w=ctx.measureText(l).width; if(w>max) max=w; });
      max=Math.ceil(max+24); const left=Math.min(360, Math.max(240, max));
      grid.style.gridTemplateColumns = left+'px 1fr';
      rows.forEach(r=> r.style.gridTemplateColumns = left+'px 1fr');
    }catch(e){}
  }

  window.addEventListener('load', ()=>{
    ensureRowMenus();
    bindOwnerPDF();
    autoGanttLeftWidth();
    const computeBtn = Array.from(document.querySelectorAll('button')).find(b=>/compute/i.test(b.textContent||''));
    if(computeBtn){
      computeBtn.addEventListener('click', ()=> setTimeout(()=>{ ensureRowMenus(); autoGanttLeftWidth(); }, 80));
    }
  });
})();


// v5.2.3: robust Summary hook + cash colgroup normalize + 3-dot autoclose
(function(){
  const $ = (s,r=document)=>r.querySelector(s);
  const $$= (s,r=document)=>Array.from(r.querySelectorAll(s));

  function hookSummary(){
    const h = Array.from(document.querySelectorAll('h2,h3,h4')).find(x=>/summary\s*&\s*exports/i.test((x.textContent||'').trim()));
    if(!h) return;
    const section = h.nextElementSibling && h.nextElementSibling.classList.contains('section') ? h.nextElementSibling : null;
    if(!section) return;
    section.classList.add('summary-section');
    const dep = $('#depTrack'); if(dep){ const blk = dep.closest('div'); if(blk) blk.classList.add('deposit-block'); }
  }

  function normalizeCashTable(){
    const t = $('#cashTable'); if(!t) return;
    const colgroups = t.querySelectorAll('colgroup');
    if(colgroups.length > 1){
      for(let i=1;i<colgroups.length;i++) colgroups[i].remove();
    }
    const sets = [t.tBodies, t.tFoot ? [t.tFoot] : []].flat();
    Array.from(sets).forEach(sec=>{
      Array.from(sec.rows||[]).forEach(tr=>{
        Array.from(tr.cells).forEach((td,i)=>{ if(i>0) td.classList.add('num'); });
      });
    });
  }

  function wireMenusAutoClose(){
    const origDup = window.duplicateRow, origRem = window.removeScope;
    window.duplicateRow = function(idx){ try{ origDup && origDup(idx); } finally { closeAnyMenu(); } };
    window.removeScope  = function(idx){ try{ origRem && origRem(idx); } finally { closeAnyMenu(); } };
    function closeAnyMenu(){ $$('.pcfp-menu').forEach(m=> m.remove()); }
  }

  window.addEventListener('load', ()=>{ hookSummary(); normalizeCashTable(); wireMenusAutoClose(); });
  const computeBtn = Array.from(document.querySelectorAll('button')).find(b=>/compute/i.test((b.textContent||'')));
  if(computeBtn){ computeBtn.addEventListener('click', ()=> setTimeout(()=>{ hookSummary(); normalizeCashTable(); }, 50)); }
  document.addEventListener('pcfp:computed', ()=>{ hookSummary(); normalizeCashTable(); });
})();


// v5.2.4 Monthly Cash-Flow: Strict Table Renderer + Grid Ledger fallback
(function(){
  const $ = (s,r=document)=>r.querySelector(s);
  const $$= (s,r=document)=>Array.from(r.querySelectorAll(s));

  const DEFAULT_WIDTHS = [180,150,150,150,170,130,180,190];

  function getCashTable(){
    return $('#cashTable');
  }

  function extractSchemaFromThead(t){
    const ths = Array.from(t.tHead ? t.tHead.rows[0].cells : []);
    return ths.length ? ths.map(th => (th.textContent||'').trim()) : [];
  }

  function extractWidthsFromColgroup(t){
    const cg = t.querySelector('colgroup');
    if(!cg) return null;
    const cols = Array.from(cg.querySelectorAll('col'));
    return cols.length ? cols.map(c => {
      const w = (c.style && c.style.width) ? parseInt(c.style.width,10) : NaN;
      return Number.isFinite(w) ? w : null;
    }) : null;
  }

  function readTableData(t){
    const rows = [];
    const schemaLen = (t.tHead && t.tHead.rows[0]) ? t.tHead.rows[0].cells.length : 0;
    const bodies = Array.from(t.tBodies||[]);
    bodies.forEach(tb => {
      Array.from(tb.rows).forEach(tr => {
        const cells = Array.from(tr.cells).map(td => (td.textContent||'').trim());
        rows.push(cells.slice(0, schemaLen || cells.length));
      });
    });
    const foot = t.tFoot && t.tFoot.rows[0] ? Array.from(t.tFoot.rows[0].cells).map(td => (td.textContent||'').trim()) : null;
    return {rows, foot};
  }

  function ensureWarn(){
    let warn = $('#cashWarn');
    if(!warn){
      warn = document.createElement('div');
      warn.id='cashWarn';
      const parent = getCashTable()?.parentElement || document.body;
      parent.insertBefore(warn, getCashTable());
    }
    return warn;
  }

  function showWarn(msg){
    const w = ensureWarn();
    w.textContent = msg;
    w.classList.add('show');
  }
  function hideWarn(){
    const w = ensureWarn();
    w.classList.remove('show');
    w.textContent='';
  }

  function buildStrictTable(schema, widths, bodyRows, footRow){
    const t = document.createElement('table');
    t.id = 'cashTable';
    // colgroup
    const cg = document.createElement('colgroup');
    (widths || DEFAULT_WIDTHS).slice(0, schema.length).forEach(w=>{
      const c = document.createElement('col');
      if(w) c.style.width = (typeof w === 'number' ? w : parseInt(w||0,10)) + 'px';
      cg.appendChild(c);
    });
    t.appendChild(cg);
    // thead
    const thead = document.createElement('thead');
    const thr = document.createElement('tr');
    schema.forEach(label=>{
      const th = document.createElement('th');
      th.textContent = label;
      th.title = label;
      thr.appendChild(th);
    });
    thead.appendChild(thr);
    t.appendChild(thead);
    // tbody
    const tbody = document.createElement('tbody');
    bodyRows.forEach(r=>{
      const tr = document.createElement('tr');
      for(let i=0;i<schema.length;i++){
        const td = document.createElement('td');
        const v = (r[i] ?? '').toString();
        td.textContent = v;
        if(i>0) td.classList.add('num');
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    t.appendChild(tbody);
    // tfoot
    if(footRow && footRow.length){
      const tfoot = document.createElement('tfoot');
      const tr = document.createElement('tr');
      for(let i=0;i<schema.length;i++){
        const td = document.createElement('td');
        const v = (footRow[i] ?? '').toString();
        td.textContent = v;
        if(i>0) td.classList.add('num');
        tr.appendChild(td);
      }
      tfoot.appendChild(tr);
      t.appendChild(tfoot);
    }
    return t;
  }

  function strictRenderCashTable(){
    const tbl = getCashTable();
    if(!tbl) return;
    hideWarn();
    // schema & widths
    const schema = extractSchemaFromThead(tbl);
    if(!schema.length){
      showWarn('Cash table missing header schema.'); return;
    }
    const widths = extractWidthsFromColgroup(tbl) || DEFAULT_WIDTHS.slice(0, schema.length);
    // capture data first
    const {rows, foot} = readTableData(tbl);
    // sanity checks
    const expected = schema.length;
    const badRows = rows
      .map((r,idx)=> r.length===expected ? null : {idx, got:r.length, expected})
      .filter(Boolean);
    // rebuild in-place
    const parent = tbl.parentElement;
    const next = tbl.nextSibling;
    const newTable = buildStrictTable(schema, widths, rows, foot);
    parent.removeChild(tbl);
    parent.insertBefore(newTable, next);

    if(badRows.length){
      showWarn(`Monthly Cash-Flow: ${badRows.length} row(s) had a column count mismatch; rebuilt with strict schema of ${expected}.`);
    }
  }

  // ---- Grid Ledger (visual fallback) ----
  function buildGridLedger(){
    const tbl = getCashTable();
    if(!tbl || !tbl.tHead) return null;
    const schema = Array.from(tbl.tHead.rows[0].cells).map(th => (th.textContent||'').trim());
    const widths = extractWidthsFromColgroup(tbl) || DEFAULT_WIDTHS.slice(0, schema.length);
    const {rows, foot} = readTableData(tbl);

    const grid = document.createElement('div');
    grid.id='cashGrid';
    grid.style.gridTemplateColumns = widths.slice(0, schema.length).map(w=> (typeof w==='number'? w : parseInt(w||0,10)) + 'px').join(' ');

    // header
    const headRow = document.createElement('div'); headRow.className='gRow';
    schema.forEach((label,i)=>{
      const c = document.createElement('div'); c.className='gCell gHead'+(i>0?' num':'');
      c.textContent = label; c.title=label;
      headRow.appendChild(c);
    });
    grid.appendChild(headRow);

    // body
    rows.forEach(r=>{
      const row = document.createElement('div'); row.className='gRow';
      for(let i=0;i<schema.length;i++){
        const c = document.createElement('div'); c.className='gCell'+(i>0?' num':'');
        c.textContent = (r[i] ?? '').toString();
        row.appendChild(c);
      }
      grid.appendChild(row);
    });

    // footer
    if(foot && foot.length){
      const row = document.createElement('div'); row.className='gRow';
      for(let i=0;i<schema.length;i++){
        const c = document.createElement('div'); c.className='gCell gHead'+(i>0?' num':'');
        c.textContent = (foot[i] ?? '').toString();
        row.appendChild(c);
      }
      grid.appendChild(row);
    }
    return grid;
  }

  // Public toggles
  window.__pcfp_useGridLedger = true; // set true to show grid instead of table

  function applyCashFixes(){
    let __pcfp_widths_emitted=null;
    strictRenderCashTable();
    const wrap = getCashTable()?.parentElement;
    if(!wrap) return;
    const oldGrid = $('#cashGrid'); if(oldGrid) oldGrid.remove();
    const grid = buildGridLedger();
    try{
      const tbl=document.querySelector('#cashTable');
      if(tbl){
        const cols = Array.from((tbl.querySelector('colgroup')||{}).children||[]).map(c=>parseInt(c.style.width||'0')); 
        const thead = tbl.tHead && tbl.tHead.rows[0] ? Array.from(tbl.tHead.rows[0].cells).map(th=>th.textContent.trim()) : [];
        __pcfp_widths_emitted = {cols: cols, headers: thead};
        document.dispatchEvent(new CustomEvent('pcfp:cashTableReady',{detail: __pcfp_widths_emitted}));
      }
    }catch(e){}

    if(grid && window.__pcfp_useGridLedger){
      // hide table, show grid
      getCashTable().style.display='none';
      wrap.appendChild(grid);
    }else{
      // show table
      getCashTable().style.display='table';
    }
  }

  window.addEventListener('load', ()=> setTimeout(applyCashFixes, 30));
  const computeBtn = Array.from(document.querySelectorAll('button')).find(b=>/compute/i.test((b.textContent||'')));
  if(computeBtn){ computeBtn.addEventListener('click', ()=> setTimeout(applyCashFixes, 60)); }
  document.addEventListener('pcfp:computed', ()=> applyCashFixes());
})();


// v5.2.4a: Render Gantt after cash table is ready + no DOM measurement dependency
(function(){
  const origRender = window.renderGantt || null;
  function safeRender(detail){
    try{
      const widths = (detail && detail.cols && detail.cols.length) ? detail.cols : [180,150,150,150,170,130,180,190];
      window.__pcfp_cashWidths = widths;
      if(origRender){ origRender(); }
    }catch(e){ console.error('renderGantt failed', e); }
  }
  window.pcfp_renderGantt_wrapper = function(){
    if(window.__pcfp_cashWidths){ try{ origRender && origRender(); return; } catch(e){} }
    let called=false;
    function once(ev){ if(called) return; called=true; document.removeEventListener('pcfp:cashTableReady', once); safeRender(ev && ev.detail); }
    document.addEventListener('pcfp:cashTableReady', once, {once:true});
    setTimeout(()=>{ if(!called) safeRender(null); }, 80);
  };
  if(origRender){ window.renderGantt = window.pcfp_renderGantt_wrapper; }
  document.addEventListener('pcfp:computed', ()=> window.pcfp_renderGantt_wrapper && window.pcfp_renderGantt_wrapper());
  window.addEventListener('load', ()=> setTimeout(()=> window.pcfp_renderGantt_wrapper && window.pcfp_renderGantt_wrapper(), 100));
})();


// v6.1.1: header cleanup (remove Density/Mobile/Share; keep Scenario)
(function(){
  const $$= (s,r=document)=>Array.from(r.querySelectorAll(s));
  function pruneHeaderButtons(){
    const kill = /^(density|mobile|share)$/i;
    $$('header button, .topbar button, .toolbar button, nav button').forEach(b=>{
      const t=(b.textContent||b.title||'').trim().toLowerCase();
      if(kill.test(t)) b.remove();
    });
  }
  window.addEventListener('load', pruneHeaderButtons);
})();


// v6.1.1: hardened 3-dot action menu; remove inline Duplicate/Remove
(function(){
  const $ = (s,r=document)=>r.querySelector(s);
  const $$= (s,r=document)=>Array.from(r.querySelectorAll(s));
  let openMenu = null;
  function closeMenu(){ if(openMenu){ openMenu.remove(); openMenu=null; } }
  function buildMenu(rowIdx, anchor){
    closeMenu();
    const m=document.createElement('div'); m.className='pcfp-menu';
    const actions=[
      ['📄 Duplicate', ()=> window.duplicateRow && window.duplicateRow(rowIdx) ],
      ['🗑️ Remove',   ()=> window.removeScope && window.removeScope(rowIdx) ],
      ['🔢 Week Breakdown', ()=> window.__wkBreak && window.__wkBreak(rowIdx) ],
      ['📝 Note…', ()=> window.__focusNotes && window.__focusNotes(rowIdx) ],
    ];
    actions.forEach(([label,fn])=>{
      const b=document.createElement('button'); b.type='button'; b.textContent=label;
      b.addEventListener('click', (e)=>{ e.stopPropagation(); try{ fn&&fn(); } finally { closeMenu(); } });
      m.appendChild(b);
    });
    m.addEventListener('click', e=> e.stopPropagation());
    document.body.appendChild(m);
    const r=anchor.getBoundingClientRect();
    m.style.cssText='position:absolute;z-index:1000;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.08);min-width:180px;padding:6px;';
    m.style.top=(r.bottom+window.scrollY+6)+'px';
    m.style.left=(r.right+window.scrollX-200)+'px';
    openMenu=m;
  }
  function wireDots(){
    const tbody = $('#scopeTable tbody'); if(!tbody) return;
    $$('#scopeTable tbody tr').forEach(tr=>{
      Array.from(tr.querySelectorAll('button')).forEach(b=>{
        const t=(b.textContent||'').trim().toLowerCase();
        if(t==='duplicate' || t==='remove') b.remove();
      });
      const cell = tr.lastElementChild; if(!cell) return;
      let btn = cell.querySelector('.pcfp-menu-btn');
      if(!btn){
        btn = document.createElement('button');
        btn.type='button'; btn.className='pcfp-menu-btn'; btn.textContent='⋯';
        cell.style.textAlign='right'; cell.appendChild(btn);
      }
    });
    tbody.removeEventListener('click', window.__pcfpDotsHandler || (()=>{}), true);
    function handler(e){
      const target = e.target.closest('.pcfp-menu-btn'); if(!target) return;
      e.preventDefault(); e.stopPropagation();
      const tr = target.closest('tr'); if(!tr) return;
      const idx = +tr.dataset.i || Array.from(tr.parentNode.children).indexOf(tr);
      buildMenu(idx, target);
    }
    window.__pcfpDotsHandler = handler;
    tbody.addEventListener('click', handler, true);
  }
  document.addEventListener('click', (e)=>{ if(openMenu && !openMenu.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });
  window.addEventListener('scroll', ()=> closeMenu(), true);
  window.addEventListener('resize', ()=> closeMenu());
  window.addEventListener('load', wireDots);
  document.addEventListener('pcfp:computed', ()=> setTimeout(wireDots, 20));
  const computeBtn = Array.from(document.querySelectorAll('button')).find(b=>/compute/i.test((b.textContent||'')));
  if(computeBtn){ computeBtn.addEventListener('click', ()=> setTimeout(wireDots,60)); }
})();


// v6.1.1: robust Gantt re-render hooks
(function(){
  function safeRender(){
    try { if (typeof window.renderGantt === 'function') window.renderGantt(); } catch(e){ console.warn('renderGantt failed', e); }
  }
  window.addEventListener('load', ()=> setTimeout(safeRender, 80));
  document.addEventListener('pcfp:computed', ()=> setTimeout(safeRender, 40));
  window.addEventListener('resize', ()=> setTimeout(safeRender, 60));
  const btn = Array.from(document.querySelectorAll('button')).find(b=>/compute/i.test((b.textContent||'')));
  if(btn){ btn.addEventListener('click', ()=> setTimeout(safeRender, 120)); }
})();


// v6.2 schema guard (non-breaking)
(function(){
  function getProfiles(){
    try{
      const raw = localStorage.getItem('pcfp_profiles_v1');
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    }catch(e){ return []; }
  }
  function ensureSchema(){
    const list = getProfiles();
    if(!list.length){ return; }
    const p = list[0] || {};
    if(p.schemaVersion === 1){ return; }
    const host = document.querySelector('body') || document.documentElement;
    const b = document.createElement('div');
    b.className = 'pcfp-banner';
    b.textContent = 'This profile uses schemaVersion ' + (p.schemaVersion || 'unknown') + ' but this app expects schemaVersion 1.';
    host.insertBefore(b, host.firstChild);
  }
  window.addEventListener('load', ensureSchema);
})();


// v6.3: use CoreMenu for 3-dot actions
(function(){
  function buildItems(rowIdx){
    return [
      { label:'📄 Duplicate', onClick: function(){ window.duplicateRow && window.duplicateRow(rowIdx); } },
      { label:'🗑️ Remove',   onClick: function(){ window.removeScope && window.removeScope(rowIdx); } },
      { label:'🔢 Week Breakdown', onClick: function(){ window.__wkBreak && window.__wkBreak(rowIdx); } },
      { label:'📝 Note…', onClick: function(){ window.__focusNotes && window.__focusNotes(rowIdx); } },
    ];
  }
  function wireDots(){
    var tbody = document.querySelector('#scopeTable tbody'); if(!tbody) return;
    Array.prototype.slice.call(tbody.querySelectorAll('tr')).forEach(function(tr){
      Array.prototype.slice.call(tr.querySelectorAll('button')).forEach(function(b){
        var t=(b.textContent||'').trim().toLowerCase();
        if(t==='duplicate' || t==='remove') b.remove();
      });
      var cell = tr.lastElementChild; if(!cell) return;
      var btn = cell.querySelector('.pcfp-menu-btn');
      if(!btn){ btn=document.createElement('button'); btn.type='button'; btn.className='pcfp-menu-btn'; btn.textContent='⋯'; cell.style.textAlign='right'; cell.appendChild(btn); }
    });
    function handler(e){
      var t=e.target.closest('.pcfp-menu-btn'); if(!t) return;
      e.preventDefault(); e.stopPropagation();
      var tr=t.closest('tr'); if(!tr) return;
      var idx = +tr.dataset.i || Array.prototype.indexOf.call(tr.parentNode.children, tr);
      if(window.CoreMenu && CoreMenu.open){ CoreMenu.open(t, buildItems(idx), {autoClose:true}); }
    }
    if(window.__pcfpDotsHandler) tbody.removeEventListener('click', window.__pcfpDotsHandler, true);
    window.__pcfpDotsHandler = handler;
    tbody.addEventListener('click', handler, true);
  }
  window.addEventListener('load', function(){ setTimeout(wireDots, 50); });
  document.addEventListener('pcfp:computed', function(){ setTimeout(wireDots, 20); });
})();

// v6.3: prepare CoreGantt instance (non-breaking; defers to existing data if present)
(function(){
  var instance = null;
  function collectTasksFallback(){
    if(Array.isArray(window.__pcfpTasks)){ return window.__pcfpTasks; }
    return [];
  }
  function ensure(){
    var host = document.getElementById('ganttRoot') || document.querySelector('#ganttRoot, .gantt-root');
    if(!host || !window.CoreGantt) return;
    if(!instance){ instance = CoreGantt.create(host, {}); }
    var tasks = collectTasksFallback();
    if(tasks.length){ instance.render({ tasks: tasks }); }
  }
  window.addEventListener('load', function(){ setTimeout(ensure, 120); });
  document.addEventListener('pcfp:computed', function(){ setTimeout(ensure, 80); });
  window.addEventListener('resize', function(){ setTimeout(ensure, 120); });
})();
// v6.3.1 menu hardening: force menu-only actions (no inline buttons), with guards & observer
(function(){
  var INLINE_TXT = /^(duplicate|remove)$/i;
  var scopeTbody = null;
  function zapInlineButtons(root){
    var host = root || document;
    var btns = Array.prototype.slice.call(host.querySelectorAll('#scopeTable tbody button'));
    btns.forEach(function(b){
      var t = (b.textContent||'').trim().toLowerCase();
      if (INLINE_TXT.test(t)) { b.remove(); }
    });
    // Ensure each row has a ⋯ button
    Array.prototype.slice.call((host.querySelector('#scopeTable tbody')||{}).children||[]).forEach(function(tr){
      if (!(tr && tr.nodeType===1)) return;
      var cell = tr.lastElementChild; if (!cell) return;
      var dots = cell.querySelector('.pcfp-menu-btn');
      if (!dots) {
        var btn=document.createElement('button'); btn.type='button'; btn.className='pcfp-menu-btn'; btn.textContent='⋯';
        cell.style.textAlign='right'; cell.appendChild(btn);
      }
    });
  }
  function observeTable(){
    var tbody = document.querySelector('#scopeTable tbody');
    if (!tbody) return;
    scopeTbody = tbody;
    if (window.__pcfpMO) { try { window.__pcfpMO.disconnect(); } catch(e){} }
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        if (m.addedNodes && m.addedNodes.length){
          m.addedNodes.forEach(function(n){
            if (n.nodeType===1) zapInlineButtons(n);
          });
        }
      });
    });
    mo.observe(tbody, {childList:true, subtree:true});
    window.__pcfpMO = mo;
  }
  // Wrap duplicate/remove to cleanup after action
  function wrapAction(name){
    var fn = window[name];
    window[name] = function(){
      try { return fn && fn.apply(this, arguments); }
      finally { setTimeout(function(){ zapInlineButtons(document); }, 10); }
    };
  }
  ['duplicateRow','removeScope'].forEach(function(n){
    if (!window['__wrapped_'+n]){ wrapAction(n); window['__wrapped_'+n]=true; }
  });
  // Initial run + hooks
  window.addEventListener('load', function(){ setTimeout(function(){ zapInlineButtons(document); observeTable(); }, 60); });
  document.addEventListener('pcfp:computed', function(){ setTimeout(function(){ zapInlineButtons(document); observeTable(); }, 30); });
})();
// v6.3.1 CoreGantt full wire: build tasks from profile/scope/schedule and render consistently
(function(){
  var ganttInstance = null;
  function getProfile(){
    // Try common globals from previous versions
    if (window.__pcfpProfile && typeof window.__pcfpProfile === 'object') return window.__pcfpProfile;
    if (window.__pcfp && typeof window.__pcfp === 'object' && window.__pcfp.profile) return window.__pcfp.profile;
    // Fallback: synthesize minimal from DOM (settings + months)
    var settings = { markup:20, hst:13 };
    try {
      var raw = localStorage.getItem('pcfp_profiles_v1');
      var arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr) && arr.length) return arr[0];
    } catch(e){}
    return { id:'unknown', name:'Ad-hoc', schemaVersion:1, settings: settings, schedule: getScheduleFromDOM(), modules: { paymentPlanner: { scope: getScopeFromDOM(), months: getMonthsFromDOM() } } };
  }
  function getMonthsFromDOM(){
    var out=[]; var rows = document.querySelectorAll('#monthsTable tbody tr');
    if(!rows.length) return out;
    var wk=1;
    Array.prototype.slice.call(rows).forEach(function(tr,i){
      var weeksCell = tr.querySelector('[data-col="weeks"], input[name*="weeks"]') || tr.children[1];
      var weeks = weeksCell ? parseInt((weeksCell.value||weeksCell.textContent||'').replace(/\D+/g,''),10) : 4;
      out.push({ label: 'Month '+(i+1), weeks: weeks||4, startWeek: wk });
      wk += weeks||4;
    });
    return out;
  }
  function getScheduleFromDOM(){
    var months = getMonthsFromDOM(); var totalWeeks = months.reduce(function(a,m){return a+(m.weeks||0)},0) || 18;
    return { startDate: null, totalWeeks: totalWeeks,
      monthBoundaries: months.map(function(m,idx){ return { month:'M'+(idx+1), year:0, startWeek:m.startWeek, weeks:m.weeks }; })
    };
  }
  function numFrom(el){
    if(!el) return 0;
    var v = (el.value != null ? el.value : el.textContent)||'';
    var m = String(v).match(/-?\d+/); return m ? parseInt(m[0],10) : 0;
  }
  function getScopeFromDOM(){
    var out=[]; var rows = document.querySelectorAll('#scopeTable tbody tr');
    Array.prototype.slice.call(rows).forEach(function(tr){
      var code = (tr.querySelector('[data-col="code"]')||{}).textContent || '';
      var name = (tr.querySelector('[data-col="name"]')||{}).textContent || '';
      var start = numFrom(tr.querySelector('[data-col="startWeek"], input[name*="start"]'));
      var dur   = numFrom(tr.querySelector('[data-col="durationWeeks"], input[name*="duration"]'));
      var amtEl = tr.querySelector('[data-col="baseAmount"], input[name*="amount"], input[name*="base"]');
      var cents = Math.round(parseFloat((amtEl && (amtEl.value||amtEl.textContent)||'0').replace(/[^0-9.]/g,''))*100)||0;
      out.push({ code: code.trim(), name: name.trim(), startWeek: start||1, durationWeeks: Math.max(0, dur||0), baseAmountCents: cents });
    });
    return out;
  }
  function buildGanttTasks(profile){
    var scope = (((profile||{}).modules||{}).paymentPlanner||{}).scope || getScopeFromDOM();
    var tasks = [];
    scope.forEach(function(it){
      var label = (it.code ? it.code+' ' : '') + (it.name||'Scope');
      var start = Math.max(0, (it.startWeek||1)-1);
      var dur   = Math.max(1, it.durationWeeks||1);
      tasks.push({ label: label, start: start, duration: dur });
    });
    return tasks;
  }
  function renderGanttNow(){
    var host = document.getElementById('ganttRoot') || document.querySelector('#ganttRoot, .gantt-root');
    if (!host || !window.CoreGantt) return;
    if (!ganttInstance){ ganttInstance = CoreGantt.create(host, {}); }
    var profile = getProfile();
    var tasks = buildGanttTasks(profile);
    ganttInstance.render({ tasks: tasks });
    // expose builder for exports
    window.__buildGanttTasks = buildGanttTasks;
  }
  window.addEventListener('load', function(){ setTimeout(renderGanttNow, 150); });
  document.addEventListener('pcfp:computed', function(){ setTimeout(renderGanttNow, 60); });
  window.addEventListener('resize', function(){ setTimeout(renderGanttNow, 120); });
})();
// v6.4 wire-up to core compute + panel
(function(){
  function formatCents(c){ return (c/100).toFixed(2); }
  function getProfileFromDOM(){
    const months = Array.from(document.querySelectorAll('#monthsTable tbody tr')).map((tr,i)=>{
      const inp = tr.querySelector('input, [data-col="weeks"]');
      const raw = (inp && (inp.value||inp.textContent)) || '4';
      return { label: 'Month ' + (i+1), weeks: parseInt(raw.replace(/\D+/g,'')) || 4 };
    });
    const scope = Array.from(document.querySelectorAll('#scopeTable tbody tr')).map(tr=>{
      const num = sel => { const el = tr.querySelector(sel); const raw = (el?.value ?? el?.textContent ?? '0')+''; const n = parseFloat(raw.replace(/[^0-9.\-]/g,'')); return isNaN(n)?0:n; };
      const code = (tr.querySelector('[data-col="code"]')?.textContent||'').trim();
      const name = (tr.querySelector('[data-col="name"]')?.textContent||'').trim();
      const startWeek = Math.max(1, parseInt(num('[data-col="startWeek"], input[name*="start"]'))||1);
      const durationWeeks = Math.max(1, parseInt(num('[data-col="durationWeeks"], input[name*="duration"]'))||1);
      const baseAmountCents = Math.round(num('[data-col="baseAmount"], input[name*="base"], input[name*="amount"]')*100);
      return { code, name, startWeek, durationWeeks, baseAmountCents };
    });
    const settings = (window.__pcfp && __pcfp.profile?.settings) || { hstPct:13, contractorMarkupPct:20, depositPct:30, depositDrawPct:20, holdbackPct:10, holdbackReleaseDays:60, depositFloorPctPreHST:10 };
    return { type:'ProjectProfile', schemaVersion:1, id:'ad-hoc', name:'Ad-hoc', settings, schedule:{ startDate:null, totalWeeks: months.reduce((a,m)=>a+m.weeks,0), months }, modules:{ paymentPlanner:{ scope } } };
  }
  function showComputePanel(result){
    const el = document.getElementById('computePanel');
    const body = document.getElementById('computePanelBody');
    if(!el||!body) return;
    const lines = [];
    lines.push('Monthly breakdown:');
    result.months.forEach(m=>{
      lines.push(`Month ${m.monthIndex}: earnedBase=$${formatCents(m.earnedBase)} markup=$${formatCents(m.markup)} preHstSubtotal=$${formatCents(m.preHstSubtotal)} depositApplied=$${formatCents(m.depositApplied)} holdback=$${formatCents(m.holdback)} HST=$${formatCents(m.hstAmt)} due=$${formatCents(m.due)}`);
    });
    body.textContent = lines.join('\n');
    // auto-show disabled in v6.4.1 toggle-only
  }
  function hookCompute(){
    const btn = document.querySelector('[data-action="compute"], #computeBtn');
    if(!btn || btn.__v64) return; btn.__v64 = true;
    btn.addEventListener('click', function(){
      try{
        const profile = getProfileFromDOM();
        const result = window.__pcfpCompute.computeMonthly(profile);
        document.dispatchEvent(new CustomEvent('pcfp:computed', { detail: result }));
        showComputePanel(result);
      }catch(e){ console.error('v6.4 compute error', e); }
    });
  }
  window.addEventListener('load', ()=> setTimeout(hookCompute, 120));
  document.addEventListener('DOMContentLoaded', hookCompute);
  document.addEventListener('pcfp:bind', hookCompute);
})();
