import{r as x,u as h,a as $,m as k,b as B,j as a,c as g,d as I,B as P,e as R,f as T,g as z,h as p,P as i,i as _}from"./index-DFNNv57H.js";const v=x.forwardRef(({bsPrefix:r,active:d,disabled:n,eventKey:c,className:s,variant:o,action:u,as:e,...t},l)=>{r=h(r,"list-group-item");const[m,w]=$({key:k(c,t.href),active:d,...t}),b=B(f=>{if(n){f.preventDefault(),f.stopPropagation();return}m.onClick(f)});n&&t.tabIndex===void 0&&(t.tabIndex=-1,t["aria-disabled"]=!0);const N=e||(u?t.href?"a":"button":"div");return a.jsx(N,{ref:l,...t,...m,onClick:b,className:g(s,r,w.isActive&&"active",n&&"disabled",o&&`${r}-${o}`,u&&`${r}-action`)})});v.displayName="ListGroupItem";const y=x.forwardRef((r,d)=>{const{className:n,bsPrefix:c,variant:s,horizontal:o,numbered:u,as:e="div",...t}=I(r,{activeKey:"onSelect"}),l=h(c,"list-group");let m;return o&&(m=o===!0?"horizontal":`horizontal-${o}`),a.jsx(P,{ref:d,...t,as:e,className:g(n,l,s&&`${l}-${s}`,m&&`${l}-${m}`,u&&`${l}-numbered`)})});y.displayName="ListGroup";const j=Object.assign(y,{Item:v}),E=p(j.Item)`
  background: transparent !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  transition: var(--transition-default);
  padding: 0.75rem var(--space-md) !important;
  text-align: left !important;

  &:hover {
    background: var(--color-surface) !important;
  }
`,q=p(_)`
  color: var(--color-text) !important;
  padding: 0 !important;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-default);

  &:hover {
    color: var(--color-primary) !important;
    transform: scale(1.1);
  }

  &:focus {
    box-shadow: none !important;
  }
`,C=p.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-align: left !important;
`,L=p.div`
  color: var(--color-text);
  font-weight: 500;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left !important;
`,S=p.div`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,A=p.span`
  display: inline-flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 1.2rem;
`,G=({tracks:r})=>{const[d,n]=x.useState(null),[c,s]=x.useState(null),o=e=>{const t=Math.floor(e/6e4),l=Math.floor(e%6e4/1e3);return`${t}:${l.toString().padStart(2,"0")}`},u=e=>{if(e.preview_url)if(d===e.id)c.pause(),n(null),s(null);else{c&&c.pause();const t=new Audio(e.preview_url);t.play(),n(e.id),s(t),t.onended=()=>{n(null),s(null)}}};return a.jsx(j,{variant:"flush",children:r.map((e,t)=>a.jsxs(E,{className:"d-flex align-items-center gap-3",children:[a.jsx("div",{style:{width:"40px",textAlign:"center"},children:e.preview_url?a.jsx(q,{variant:"link",onClick:()=>u(e),children:d===e.id?a.jsx(R,{}):a.jsx(T,{})}):a.jsx("span",{className:"text-muted",style:{fontSize:"1.5rem"},children:"♪"})}),a.jsxs(C,{className:"flex-grow-1",children:[a.jsx(L,{children:e.name}),a.jsxs(S,{children:[a.jsx("span",{children:o(e.duration_ms)}),e.explicit&&a.jsx(A,{title:"Explicit",children:a.jsx(z,{})})]})]})]},e.id))})};G.propTypes={tracks:i.arrayOf(i.shape({id:i.string.isRequired,name:i.string.isRequired,duration_ms:i.number.isRequired,track_number:i.number.isRequired,preview_url:i.string,external_urls:i.shape({spotify:i.string}),artists:i.arrayOf(i.shape({name:i.string.isRequired}))})).isRequired};export{G as default};
