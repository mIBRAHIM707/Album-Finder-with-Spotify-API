import{r as d,j as t,C as g,A as h,h as s,R as f}from"./index-DFNNv57H.js";const u=s.section`
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`,b=s.h4`
  color: var(--color-text);
  margin-bottom: var(--space-lg);
  font-weight: 700;
`,A=s(f)`
  margin: 0 -12px;
  
  > div {
    padding: 12px;
  }
`;s.p`
  color: var(--color-text-secondary);
  text-align: center;
  padding: var(--space-lg) 0;
`;const w=({artistId:r,currentAlbumId:c})=>{const[l,m]=d.useState([]),a=localStorage.getItem("accessToken");return d.useEffect(()=>{r&&a&&(async()=>{try{const p=(await(await fetch(`https://api.spotify.com/v1/artists/${r}/albums?include_groups=album,single&market=US&limit=10`,{headers:{Authorization:`Bearer ${a}`}})).json()).items.filter(e=>e.id!==c).reduce((e,i)=>(e.find(x=>x.name.toLowerCase()===i.name.toLowerCase())||e.push(i),e),[]).slice(0,5);m(p)}catch(n){console.error("Error fetching related albums:",n)}})()},[r,c,a]),l.length?t.jsxs(u,{children:[t.jsx(b,{children:"More from this Artist"}),t.jsx(A,{children:l.map(o=>t.jsx(g,{xs:12,sm:6,md:4,lg:3,children:t.jsx(h,{album:o})},o.id))})]}):null};export{w as default};
