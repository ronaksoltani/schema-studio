/* Schema Studio | dependency-free browser interactions | MIT License */ "use strict";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [
  ...root.querySelectorAll(selector)
];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
  "&":"&amp;",
  "<":"&lt;",
  ">":"&gt;",
  '"':"&quot;",
  "'":"&#39;"
}
[
  char
]));
const toast = message =>{
   const node = $(".toast");
   if (!node) return;
   node.textContent = message;
   node.classList.add("is-visible");
   clearTimeout(window.toastTimer);
   window.toastTimer = setTimeout(() => node.classList.remove("is-visible"), 2600);
};
const downloadText = (filename, text, type = "text/plain;charset=utf-8") =>{
   const url = URL.createObjectURL(new Blob([
    text
  ],{
    type
  }));
   const link = document.createElement("a");
   link.href = url;
   link.download = filename;
   link.click();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const copyText = async text =>{
   try{
     await navigator.clipboard.writeText(text);
     return true;
  }
   catch{
     const field = document.createElement("textarea");
     field.value = text;
     field.style.position = "fixed";
     field.style.opacity = "0";
     document.body.append(field);
     field.select();
     const ok = document.execCommand("copy");
     field.remove();
     return ok;
  }
};
const readFileText = file => new Promise((resolve, reject) =>{
   const reader = new FileReader();
   reader.onload = () => resolve(String(reader.result));
   reader.onerror = () => reject(new Error("Could not read this file."));
   reader.readAsText(file);
});
const parseCSV = text =>{
   const rows = [
  ];
   let row = [
  ], cell = "", quoted = false;
   for (let i = 0; i < text.length; i++){
     const c = text[
      i
    ];
     if (quoted){
       if (c === '"' && text[
        i + 1
      ]
       === '"'){
         cell += '"';
         i++;
      }
       else if (c === '"') quoted = false;
       else cell += c;
    }
     else if (c === '"') quoted = true;
     else if (c === ","){
       row.push(cell);
       cell = "";
    }
     else if (c === "\n"){
       row.push(cell.replace(/\r$/, ""));
       if (row.some(value => value.trim())) rows.push(row);
       row = [
      ];
       cell = "";
    }
     else cell += c;
  }
   row.push(cell.replace(/\r$/, ""));
   if (row.some(value => value.trim())) rows.push(row);
   return rows;
};
const saveJSON = (key, value) =>{
   try{
     localStorage.setItem(key, JSON.stringify(value));
     return true;
  }
   catch{
     return false;
  }
};
const loadJSON = (key, fallback) =>{
   try{
     return JSON.parse(localStorage.getItem(key)) ?? fallback;
  }
   catch{
     return fallback;
  }
};
const menuButton = $(".menu-toggle"), nav = $("#main-navigation");
menuButton?.addEventListener("click", () =>{
   const opened = nav.classList.toggle("is-open");
   menuButton.setAttribute("aria-expanded", String(opened));
   menuButton.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
});
nav?.addEventListener("click", event =>{
   if (event.target.closest("a")){
     nav.classList.remove("is-open");
     menuButton?.setAttribute("aria-expanded", "false");
  }
});
$$('[data-toast]').forEach(button => button.addEventListener("click", () => toast(button.dataset.toast)));
$$('[data-scroll]').forEach(button => button.addEventListener("click", () => $(button.dataset.scroll)?.scrollIntoView({
  behavior:"smooth"
})));
const schemaInputs={
  Article:[
    [
      'headline',
      'Headline',
      'A clear guide for thoughtful teams'
    ],
    [
      'author',
      'Author name',
      'Ronak Soltani'
    ],
    [
      'datePublished',
      'Published date',
      '2026-10-03'
    ],
    [
      'image',
      'Image URL',
      'https://example.com/guide.jpg'
    ],
    [
      'url',
      'Page URL',
      'https://example.com/guide'
    ]
  ],
  LocalBusiness:[
    [
      'name',
      'Business name',
      'Northstar Studio'
    ],
    [
      'url',
      'Website URL',
      'https://example.com'
    ],
    [
      'telephone',
      'Telephone',
      '+1-555-0100'
    ],
    [
      'streetAddress',
      'Street address',
      '14 Example Street'
    ],
    [
      'addressLocality',
      'City',
      'Portland'
    ],
    [
      'addressRegion',
      'Region',
      'OR'
    ],
    [
      'postalCode',
      'Postal code',
      '97201'
    ]
  ],
  Product:[
    [
      'name',
      'Product name',
      'Forma vessel'
    ],
    [
      'description',
      'Description',
      'Hand-thrown stoneware in a quiet, generous form.'
    ],
    [
      'image',
      'Image URL',
      'https://example.com/vessel.jpg'
    ],
    [
      'sku',
      'SKU',
      'FORMA-08'
    ],
    [
      'price',
      'Price',
      '84'
    ],
    [
      'currency',
      'Currency',
      'USD'
    ],
    [
      'availability',
      'Availability',
      'https://schema.org/InStock'
    ]
  ],
  Event:[
    [
      'name',
      'Event name',
      'Open Air Sessions'
    ],
    [
      'startDate',
      'Start date',
      '2026-10-09T16:00'
    ],
    [
      'endDate',
      'End date',
      '2026-10-11T22:00'
    ],
    [
      'location',
      'Venue',
      'Greenfield Park'
    ],
    [
      'url',
      'Event page URL',
      'https://example.com/event'
    ]
  ]
};
const renderFields=()=>{
  $("#schema-fields").innerHTML=schemaInputs[
    $("#schema-type").value
  ].map(([
    id,
    label,
    value
  ])=>'<label for="schema-'+id+'">'+label+'<input id="schema-'+id+'" value="'+escapeHTML(value)+'" placeholder="'+escapeHTML(label)+'"></label>').join("");
};
const makeSchema=()=>{
  const type=$("#schema-type").value,values=Object.fromEntries(schemaInputs[
    type
  ].map(([
    id
  ])=>[
    id,
    $("#schema-"+id).value.trim()
  ])),schema={
    "@context":"https://schema.org",
    "@type":type
  };
  for(const [
    key,
    value
  ]
  of Object.entries(values))if(value)schema[
    key
  ]
  =key==="price"?{
    "@type":"Offer",
    "price":value,
    "priceCurrency":values.currency||"USD"
  }
  :value;
  if(type==="LocalBusiness")schema.address={
    "@type":"PostalAddress",
    streetAddress:values.streetAddress,
    addressLocality:values.addressLocality,
    addressRegion:values.addressRegion,
    postalCode:values.postalCode
  };
  if(type==="Product"){
    schema.offers={
      "@type":"Offer",
      "price":values.price,
      priceCurrency:values.currency,
      availability:values.availability
    };
    delete schema.price;
    delete schema.currency;
    delete schema.availability;
  }
  if(type==="Event")schema.location={
    "@type":"Place",
    name:values.location
  };
  if(type==="Article"&&values.author)schema.author={
    "@type":"Person",
    name:values.author
  };
  $("#schema-output").textContent=JSON.stringify(schema,null,2);
  $("#schema-status").textContent="Valid JSON generated. Review property requirements for this type before publishing.";
  return schema;
};
$("#schema-type")?.addEventListener("change",renderFields);
renderFields();
$("#build-schema")?.addEventListener("click",makeSchema);
$("#copy-schema")?.addEventListener("click",async()=>{
  if($("#schema-output").textContent.startsWith("Choose"))makeSchema();
  toast(await copyText($("#schema-output").textContent)?"JSON-LD copied.":"Copy was unavailable in this browser.");
});
makeSchema();
