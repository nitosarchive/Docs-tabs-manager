const allTabs = await chrome.tabs.query({});
const docsTab = []


function fetchDocs()  {allTabs.map((tab) =>{
  if(tab.url.includes("doc" || "docs" )){
    
    docsTab.push(tab.url)
  }
})
}

await fetchDocs()



const tabs = await chrome.tabs.query({
  url: [...docsTab
  ]
});



const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById("li_template");
const elements = new Set();

for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);
  const title = tab.title.split("-")[0].trim();
  const pathname = new URL(tab.url).pathname.slice("/docs".length);

  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = pathname;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}

async function getTab(){
  let queryOptions = {active: true || false, };
  let [tab] = await chrome.tabs.query(queryOptions);

  return tab
}

getTab()
let tabIds = []
let group;

const button = document.querySelector("button");
button.addEventListener("click", async () => {
   tabs.forEach(tab =>{
    let id = tab.id
    tabIds.push(id)
  });
  
    if (tabIds.length) {
      group = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(group, { title: "DOCS" });
    }
  });

const ungroupBtn = document.getElementById("ungroup")

ungroupBtn.addEventListener("click", async ()=>{

    if (!tabIds.length){
      tabs.forEach(tab =>{
      let id = tab.id
      tabIds.push(id)
      console.log(true)
       }); }

  await chrome.tabs.ungroup(tabIds)

});


  document.querySelector("ul").append(...elements);

