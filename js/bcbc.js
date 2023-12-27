//第一步：模拟假数据
// let list=[
//     {
//         id:1,
//         fname:'方法1',
//         url:'/A',
//         params:'无参',
//         returns:'返回值'
//     },
//     {
//         id:2,
//         fname:'方法2',
//         url:'/B',
//         params:'无参',
//         returns:'返回值'
//     },
//     {
//         id:3,
//         fname:'C',
//         url:'/C',
//         params:'无参',
//         returns:'返回值'
//     }
// ]
//有本地存储之后，去存储内容
let list=JSON.parse(localStorage.getItem('list'))||[];

//第二步：渲染数据，封装成函数，提高复用率
let tbody=document.querySelector('tbody');
function render(arr){
    let htmlStr='';
    arr.forEach(function(value,index){
    htmlStr +=`
    <tr>
                <td>${index+1}</td>
                <td>${value.fname}</td>
                <td>${value.url}</td>
                <td>${value.params}</td>
                <td>${value.returns}</td>
                <td>
                    <a href="#" class="del" data-id="${value.id}">删</a>
                    <a href="#" class="update" data-id="${value.id}">改</a>
                </td>
            </tr>
    `
})
tbody.innerHTML=htmlStr
}
render(list);

//第三步：添加数据
let fname=document.querySelector('.fname');
let url=document.querySelector('.url');
let params=document.querySelector('.params');
let returns=document.querySelector('.returns');

let add=document.querySelector('.add');
//绑定监听事件
add.addEventListener('click',function(){
    //判断输入值是否为空
    if(fname.value.trim().length===0){
        alert("请输入方法名！");
        return;
    }
    if(url.value.trim().length===0){
        alert("请输入方法接口路径！");
        return;
    }
    if(params.value.trim().length===0){
        alert("请输入方法参数！");
        return;
    }
    if(returns.value.trim().length===0){
        alert("请输入方法返回值！");
        return;
    }

    //创建对象，格式与原数组保持一致
    let obj={
        id:list.length>0?list[list.length-1].id+1:1,
        fname:fname.value,
        url:url.value,
        params:params.value,
        returns:returns.value
    }
    list.push(obj);
    //再次渲染
    render(list);
    //添加之后本地存储
    saveLocal();

    //添加完数据之后将表单内容清空
    fname.value='';
    url.value='';
    params.value='';
    returns.value='';
})

//第四步：删除功能，利用事件委托给tbody添加监听事件
tbody.addEventListener('click',function(e){
    if(e.target.classList.contains('del')){
        console.log(e.target.dataset.id);
        //通过filter方法实现删除
        list=list.filter(function(value,index){
            return value.id != e.target.dataset.id
        })
        // console.log(list)
        render(list);
        //删除之后本地存储
        saveLocal();
    }
})

//第五步：查询功能
//获取元素
let searchValue=document.querySelector('.searchValue');
let search=document.querySelector('.search');
//给查询按钮增加监听事件
search.addEventListener('click',function(){
    if(searchValue.value==='请选择'){
        render(list);
    }else{
        //用filter方法过滤出想要查询的数组给新数组再次渲染
        //只能用新数组接收过滤后的数组，不能赋值给原数组，会把数组其他元素给删除
        let newArr=list.filter(function(value,index){
            return value.fname===searchValue.value
        })
        render(newArr);
    }
})

//第六步：显示模态框并且数据回填
//获取模态框表单的dom元素
let editfname=document.querySelector('#editfname');
let editurl=document.querySelector('#editurl');
let editparams=document.querySelector('#editparams');
let editreturns=document.querySelector('#editreturns');
let temp;
tbody.addEventListener('click',function(e){
    // console.log('2');
    if(e.target.classList.contains('update')){
        $('#myModal').modal('show')
        //先存再取，遍历数组
        list.forEach(function(value,index){
            //不能使用全等，value.id为数值型，e.target.dataset.id是字符型
            if(value.id == e.target.dataset.id){
                temp=value
                editfname.value=value.fname
                editurl.value=value.url
                editparams.value=value.params
                editreturns.value=value.returns
                
            }
        })
    }
})

//第七步：修改信息，获取确认按钮的dom元素
let save=document.querySelector('#save')
//绑定事件
save.addEventListener('click',function(){
    temp.fname=editfname.value
    temp.url=editurl.value
    temp.params=editparams.value
    temp.returns=editreturns.value
    //改完需要重新渲染
    render(list);
    //修改之后本地存储
    saveLocal();
})

//第八步：本地存储功能
function saveLocal(){
    localStorage.setItem('list',JSON.stringify(list));
}
