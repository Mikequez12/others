Array.prototype.sum = function() {
    return this.reduce(
        (accumulator, currentValue) => accumulator + currentValue, 0
    );
}

async function GET(page='Pools') {
    return await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1ZddWri3FgXgoYymESfFb7BizRIG6-k2KQNGkSB8-glM/values/${page}?key=AIzaSyCPoCo9JcBf6_p7JqlPDZ_6frBODdw4EAI`)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw Error('ERROR DE RESPUESTA '+response.statusText)
            }
        })
        .then((data) => {
            return data.values;
        })
}

class item {
    constructor(data) {
        [
            this.name,
            this.tier,
            this.type,
            this.desc,
            this.attr,
            this.perc,
            this.chest,
            this.raid,
            this.battle,
            this.buy,
            this.sell,
            this.exc
         ] = data;
    }
    percent(k) {
        return {
            "General":this.perc,
            "Chest":this.chest,
            "Raid":this.raid,
            "Battle":this.battle
        }[k]
    }
}

var results;

async function main() {
    results = await GET();
    results = results.slice(1);
    results = results.map((v) => new item(v));

    let ui = document.body.appendChild(document.createElement('ui'));
    ui.innerHTML = `
    <h1></h1>
    <p id='desc'></p>
    <p id='others' style="color:gray;font-size:10px;"></p>
    <p id='attr' style="color:gray;"></p>
    `;

    let s = document.body.appendChild(document.createElement('search'));
    s.innerHTML = `
    <span><label for="tier">Tier: </label><select onchange="search()" id="tier"><option selected>*</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></span>
    <span><label for="type">Tipo: </label><select onchange="search()" id="type"><option selected>*</option></select></span>
    <span><label for="chest">Cofres: </label><input onclick="search()" id="chest" type="checkbox" indeterminate></span>
    <span><label for="raid">Saqueos: </label><input onchange="search()" id="raid" type="checkbox" indeterminate></span>
    <span><label for="battle">Batalla: </label><input onchange="search()" id="battle" type="checkbox" indeterminate></span>
    <span><label for="buy">Comprable: </label><input onchange="search()" id="buy" type="checkbox" indeterminate></span>
    <span><label for="sell">Vendeble: </label><input onchange="search()" id="sell" type="checkbox" indeterminate></span>
    <span><label for="exc">Exclusividad: </label><select onchange="search()" id="exc"><option selected>*</option></select></span>
    <button onclick="search()">Buscar</button>
    <button onclick="rand()">Rand</button>
    <span><select id="per"><option>General</option><option>Chest</option><option>Raid</option><option>Battle</option></select><button onclick="prob()">Prob</button></span>
    `;

    s.querySelectorAll('input[type="checkbox"]').forEach((c)=>c.addEventListener('contextmenu',(e)=>{e.target.indeterminate=!e.target.indeterminate;e.preventDefault()}));
    s.querySelectorAll('input[type="checkbox"][indeterminate]').forEach((c)=>c.indeterminate=true);

    const types = await GET("bdd");
    types.map((v)=>v[3]).filter((v)=>v!=undefined).forEach((t)=>s.querySelector('#type').appendChild(document.createElement('option')).textContent=t);
    types.map((v)=>v[4]).filter((v)=>v!=undefined).forEach((t)=>s.querySelector('#exc').appendChild(document.createElement('option')).textContent=t);

    search();
}

function rand() {
    let candidates = search(undefined,false);
    let randint = Math.round(Math.random()*(candidates.length-1));
    alert(candidates[randint].name);
}

function prob() {
    let candidates = search(undefined,false);
    let items = [];
    let per = document.querySelector('#per').value;
    items = candidates.filter((cand)=>{
        console.log(cand.percent(per))
        return parseFloat(cand.percent(per).slice(0,-1)) >= Math.random()*100;
    });
    alert(items.map((i)=>i.name).join(', '));
}

function search(event=undefined,useObj=true) {
    if (useObj) document.querySelectorAll('item').forEach((i) => i.remove());

    let s = document.querySelector('search');

    let tier = s.querySelector('#tier');
    let type = s.querySelector('#type');
    let chest = s.querySelector('#chest');
    let raid = s.querySelector('#raid');
    let battle = s.querySelector('#battle');
    let buy = s.querySelector('#buy');
    let sell = s.querySelector('#sell');
    let exc = s.querySelector('#exc');

    res = [];
    
    console.log(exc.value);
    results.forEach((r) => {
        if (
            [
                r.tier == tier.value || tier.value == '*',
                r.type == type.value || type.value == '*',
                (r.chest!='0%') == chest.checked || chest.indeterminate == true,
                (r.raid!='0%') == raid.checked || raid.indeterminate == true,
                (r.battle!='0%') == battle.checked || battle.indeterminate == true,
                (r.buy!='') == buy.checked || buy.indeterminate == true,
                (r.sell!='') == sell.checked || sell.indeterminate == true,
                r.exc == exc.value || exc.value == '*'
            ].every((v)=>v==true)
        ) {
            console.log(r.exc);
            res.push(r);
            if (useObj) {
                let item = document.body.appendChild(document.createElement('item'));
                item.appendChild(document.createElement('h1')).textContent = r.name;
                item.addEventListener('click',(event)=>{document.querySelectorAll('.sel').forEach((el)=>el.classList.remove('sel'));item.classList.add('sel');attrs(r)})
            }
        }
    });
    return res;
}

function attrs(r) {
    document.querySelector('ui>h1').textContent = r.name;
    document.querySelector('ui>p#desc').textContent = r.desc;
    console.log(r.attr);
    document.querySelector('ui>p#attr').innerText = r.attr;
    document.querySelector('ui>p#others').innerText = `${r.type} (${r.tier}) · ${r.buy?r.buy:'Unpurchasable'} (${r.sell?r.sell:'Unmarketable'}) · ${r.excl?r.excl:'none'}`;

    let h = [document.querySelector('ui>h1'),document.querySelector('ui>p#desc'),document.querySelector('ui>p#attr'),document.querySelector('ui>p#others')].map((el) => el.offsetHeight).sum() + 80;
    console.log(h);
    document.documentElement.style.setProperty('--ui-size',h);
}

main()