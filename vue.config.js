module.exports={
  lintOnSave: false,
  //代理跨域
  devServer:{
     proxy:{
         '/api':{
             target:'http://localhost:8081',
             pathRewrite:{'^/api':'/api'}
         },
     },
     open:true,
     
  },
 

};
