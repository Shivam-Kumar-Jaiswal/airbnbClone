let  btn=document.querySelector('.user')

let  crd=document.querySelector('.crd')
let  collapse=document.querySelector(".collap")
let bookBtn =document.querySelector('.book-btn')
let  filters=document.getElementsByClassName('filter')
for(filter of filters){
    filter.addEventListener('click',async function(){
       let val= this.innerText;
       console.log(val)
       window.location.href=`http://localhost:8080/listing?categ=${val}`    
})}
btn.addEventListener('click',function(){
    crd.classList.toggle('active')
})
collapse.addEventListener('click',function(){
    crd.classList.toggle('active')
})
bookBtn.addEventListener('click',function(){
    req.flash('success','New Card Added ..')
    window.location.href='http://localhost:8080/listing'
})
let  signupbtn=document.querySelector('.help-signup')
signupbtn.addEventListener('click',function(){
    window.location.href='http://localhost:8080/signup'

})