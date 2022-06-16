import Cookie from'js-cookie'
    const state={
        isCollapse:false,
        tabsList:[
            {
                path: "/",
                name: "Home",
                label: "首页",
                icon: "s-home",
                
              }
        ],
        currentMenu:null,//用于记录当前选中路由是哪一项
        menu:[],
       
    }
  const  mutations={
        collapseMenu(state){
          state.isCollapse=!state.isCollapse
        },
        selectMenu(state,val){ //改变面包屑的tab 
            if(val.name!=='Home'){
                state.currentMenu=val
              const result=  state.tabsList.findIndex(item=>item.name ===val.name)
              if(result===-1){  //tag的列表tabslist没有则添加
                  state.tabsList.push(val)
              }
            }else{
                state.currentMenu=null  //是首页的话
               }
        },
        closeTag(state,val){
         const result=  state.tabsList.findIndex(item=>item.name===val.name)
         state.tabsList.splice(result,1)
        },
        setMenu(state,val){
           state.menu=val
           Cookie.set('menu',JSON.stringify(val))
        },
        clearMenu(state){
            state.menu=[]
            Cookie.remove('menu')
        },
        addMenu(state,router){
            if(!Cookie.get('menu')){
                return
            }
            const menu=JSON.parse(Cookie.get('menu'))
            state.menu=menu
            const menuArray=[]
            menu.forEach(item=>{
                if(item.children){
                    item.children=item.children.map(item=>{
                        item.component=()=>import(`../views/${item.url}`)
                        return item
                    })
                    menuArray.push(...item.children)
                }else{
                    item.component= () =>import(`../views/${item.url}`)
                    menuArray.push(item)
                }
            });
            //路由动态添加
            menuArray.forEach(item=>{
              
                router.addRoute('Main',item)
            })
        }
    };
  const  actions={

    }
    export default{
        state,
        mutations,
        actions
        
    }
