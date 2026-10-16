(function(){
  'use strict';
  var STATI={'attivo':'Attivo','in-attesa':'In attesa','bloccato':'Bloccato','pausa':'In pausa','chiuso':'Chiuso'};
  var dati=null, app=document.getElementById('app');
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function dataIt(d){var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(d||'');return m?m[3]+'/'+m[2]+'/'+m[1]:esc(d||'da verificare');}
  function badge(s){return '<span class="badge b-'+esc(s)+'">'+esc(STATI[s]||s)+'</span>';}
  function conta(a){var b=0,t=0;a.progetti.forEach(function(p){if(p.stato==='bloccato')b++;if(p.daTitolare&&p.daTitolare.length&&p.stato!=='chiuso')t++;});return{n:a.progetti.length,b:b,t:t};}
  function opzioni(){return '<option value="">Tutti gli stati</option>'+Object.keys(STATI).map(function(k){return '<option value="'+k+'">'+STATI[k]+'</option>';}).join('');}
  function testoP(p){return [p.nome,p.spiegazione].concat(p.blocchi||[],p.daTitolare||[],(p.prossimiPassi||[]).map(function(x){return x.passo;}),(p.cronologia||[]).map(function(x){return x.testo;})).join(' ').toLowerCase();}
  function lista(arr,fn){return arr&&arr.length?'<ul>'+arr.map(fn).join('')+'</ul>':'<p class="vuoto">Nessuno</p>';}
  function schedaProgetto(p){
    return '<article class="progetto" id="p-'+esc(p.id)+'"><div class="progetto-testa"><h2>'+esc(p.nome)+'</h2><div>'+badge(p.stato)+' <span class="agg">agg. '+dataIt(p.ultimoAggiornamento)+'</span></div></div>'+
    '<p>'+esc(p.spiegazione)+'</p><div class="sezioni">'+
    '<div class="sezione"><h3>Cronologia</h3>'+(p.cronologia.length?'<ul class="crono">'+p.cronologia.slice().reverse().map(function(e){return '<li><span class="data">'+dataIt(e.data)+'</span>'+esc(e.testo)+'</li>';}).join('')+'</ul>':'<p class="vuoto">da verificare</p>')+'</div>'+
    '<div class="sezione"><h3>Cronoprogramma</h3>'+lista(p.prossimiPassi,function(x){return '<li><span class="data">'+dataIt(x.scadenza)+'</span>'+esc(x.passo)+'</li>';})+'</div>'+
    '<div class="sezione blocco"><h3>Blocchi</h3>'+lista(p.blocchi,function(x){return '<li>'+esc(x)+'</li>';})+'</div>'+
    '<div class="sezione titolare"><h3>Cosa serve dal Titolare</h3>'+lista(p.daTitolare,function(x){return '<li>'+esc(x)+'</li>';})+'</div>'+
    '</div><div class="fonti">Fonti: '+esc((p.fonti||[]).join(', ')||'da verificare')+'</div></article>';
  }
  function home(){
    var tot=0,bl=0,ti=0;dati.aree.forEach(function(a){var c=conta(a);tot+=c.n;bl+=c.b;ti+=c.t;});
    app.innerHTML='<h1>Aree</h1><p class="sotto">'+tot+' progetti · '+bl+' bloccati · '+ti+' aspettano il Titolare</p>'+
    '<div class="barra"><input id="q" type="search" placeholder="Cerca in tutti i progetti…" aria-label="Cerca"><select id="s" aria-label="Filtra per stato">'+opzioni()+'</select></div>'+
    '<div id="ris"></div><div class="griglia" id="griglia">'+dati.aree.map(function(a){var c=conta(a);
      return '<a class="scheda" href="#/area/'+esc(a.id)+'"><h2>'+esc(a.nome)+'</h2><p>'+esc(a.descrizione)+'</p><div class="numeri"><div><b>'+c.n+'</b><span>progetti</span></div><div class="rosso"><b>'+c.b+'</b><span>bloccati</span></div><div class="ambra"><b>'+c.t+'</b><span>al Titolare</span></div></div></a>';}).join('')+'</div>';
    var q=document.getElementById('q'),s=document.getElementById('s');
    function filtra(){var t=q.value.trim().toLowerCase(),st=s.value,r=document.getElementById('ris'),g=document.getElementById('griglia');
      if(!t&&!st){r.innerHTML='';g.style.display='';return;}
      var out=[];dati.aree.forEach(function(a){a.progetti.forEach(function(p){if((!st||p.stato===st)&&(!t||testoP(p).indexOf(t)>=0))out.push('<a class="scheda" href="#/area/'+esc(a.id)+'/'+esc(p.id)+'"><h2>'+esc(p.nome)+'</h2><p>'+esc(a.nome)+'</p>'+badge(p.stato)+'</a>');});});
      g.style.display='none';r.innerHTML='<p class="sotto">'+out.length+' risultati</p><div class="griglia">'+out.join('')+'</div>';}
    q.oninput=filtra;s.onchange=filtra;
  }
  function area(id,pid){
    var a=dati.aree.filter(function(x){return x.id===id;})[0];
    if(!a){app.innerHTML='<h1>Area non trovata</h1><a class="indietro" href="#/">← Torna alle aree</a>';return;}
    var c=conta(a);
    app.innerHTML='<a class="indietro" href="#/">← Tutte le aree</a><h1>'+esc(a.nome)+'</h1><p class="sotto">'+esc(a.descrizione)+' · '+c.n+' progetti · '+c.b+' bloccati · '+c.t+' per il Titolare</p>'+
    '<div class="barra"><input id="q" type="search" placeholder="Cerca in quest\'area…" aria-label="Cerca"><select id="s" aria-label="Filtra per stato">'+opzioni()+'</select></div><div id="elenco"></div>';
    var q=document.getElementById('q'),s=document.getElementById('s');
    function disegna(){var t=q.value.trim().toLowerCase(),st=s.value;
      var ps=a.progetti.filter(function(p){return (!st||p.stato===st)&&(!t||testoP(p).indexOf(t)>=0);});
      document.getElementById('elenco').innerHTML=ps.length?ps.map(schedaProgetto).join(''):'<p class="vuoto">Nessun progetto corrisponde.</p>';}
    q.oninput=disegna;s.onchange=disegna;disegna();
    if(pid){var el=document.getElementById('p-'+pid);if(el)el.scrollIntoView();}else window.scrollTo(0,0);
  }
  function instrada(){var h=(location.hash||'#/').slice(1).split('/').filter(Boolean);if(h[0]==='area')area(h[1],h[2]);else home();}
  fetch('./progetti.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(function(d){
    dati=d;var u=new Date(d.ultimoAggiornamento);
    document.getElementById('aggiornato').textContent='Ultimo aggiornamento: '+(isNaN(u)?d.ultimoAggiornamento:u.toLocaleString('it-IT',{timeZone:'Europe/Rome',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}));
    window.addEventListener('hashchange',instrada);instrada();
  }).catch(function(e){app.innerHTML='<h1>Dati non disponibili</h1><p>Impossibile leggere progetti.json ('+esc(e.message)+'). Aprire il sito tramite un server web.</p>';});
})();
