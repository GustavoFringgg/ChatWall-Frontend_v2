import{r,i as h,c as d,d as u,a as e,b as k,v as w,x as y,F as x,D as C,E as U,k as I,o as m,g as D,h as F}from"./index-VyJHf4M5.js";import{u as N,N as P,_ as V}from"./NavbarCard-BTq0AE6c.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const B={class:"container"},T={class:"row mt-4"},A={class:"col-lg-9"},E={class:"card border border-3 border-dark"},M={class:"card-body"},S={class:"mb-3"},$={class:"mb-3"},z={key:0,class:"mb-3 img-container border border-3 border-dark text-center"},R=["src"],J={__name:"PostView",setup(j){const p=D(),{showAlert:n}=F(),l=N(),o=r(""),c=r(null),i=r(null),a=r(null),v=()=>{i.value.click()},_=t=>{const s=t.target.files[0];c.value=s,f()},f=async()=>{const t=new FormData;t.append("file",c.value),t.append("type","post");try{const s=await C(t,l.token);a.value=s.fileUrl,n("圖片上傳成功","success")}catch(s){console.log("上傳失敗：",s),n(`${s.response.data.message}`,"error",2e3)}},b=async()=>{if(!o.value)return n("請輸入貼文內容","error",1500);const t={content:o.value,image:a.value};await U(t,l.token),o.value="",a.value="",n("新增貼文成功，導回首頁","success",1500),I(()=>{setTimeout(()=>{p.push({path:"/index"})},1500)})};return h(()=>{l.loadUserInfo()}),(t,s)=>(m(),d(x,null,[u(P),e("div",B,[e("div",T,[e("main",A,[e("div",E,[s[2]||(s[2]=e("div",{class:"card-header text-center"},[e("h5",{class:"m-0"},"張貼動態")],-1)),e("div",M,[e("div",S,[s[1]||(s[1]=e("label",{for:"postContent",class:"form-label"},"貼文內容",-1)),k(e("textarea",{id:"postContent","onUpdate:modelValue":s[0]||(s[0]=g=>o.value=g),class:"form-control",cols:"10",rows:"10",style:{resize:"none"},placeholder:"輸入您的貼文內容"},null,512),[[w,o.value]])]),e("div",$,[e("div",null,[e("button",{class:"btn btn-primary",onClick:v},"上傳圖片"),e("input",{ref_key:"fileInput",ref:i,type:"file",class:"d-none",onChange:_},null,544)])]),a.value?(m(),d("div",z,[e("img",{src:a.value,alt:"Image Preview",class:"img-fluid-cos"},null,8,R)])):y("",!0),e("button",{class:"btn btn-success w-100",onClick:b},"送出貼文")])])]),u(V)])])],64))}};export{J as default};
