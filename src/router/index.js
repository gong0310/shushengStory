import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
// 报NavigationDuplicated的可能解决方案
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: "/",
    redirect: '/home'
  },
  {
    path: "/home",
    name: "home",
    // component: Home
    component: () =>
    import(/* webpackChunkName: "Home" */ "../components/Home.vue")
  },
  {
    path: "/classify",
    name: "classify",
    component: () =>
      import(/* webpackChunkName: "classify" */ "../components/Classify.vue")
  },
  {
    path: "/category",
    name: "category",
    component: () =>
      import(/* webpackChunkName: "category" */ "../components/Category.vue")
  },
  {
    path: "/book",
    name: "book",
    component: () => import(/* webpackChunkName: "book" */ "../components/Book.vue")
  },
  {
    path: "/read",
    name: "read",
    component: () => import(/* webpackChunkName: "read" */ "../components/common/Read.vue")
  },
  {
    path: "/ranking",
    name: "ranking",
    component: () =>
      import(/* webpackChunkName: "ranking" */ "../components/Ranking.vue")
  },
  {
    path: "/search",
    name: "search",
    component: () =>
      import(/* webpackChunkName: "search" */ "../components/Search.vue")
  },
  {
    path: "/mulu",
    name: "mulu",
    component: () =>
      import(/* webpackChunkName: "mulu" */ "../components/common/Mulu.vue")
  },
  {
    path: "/myshelf",
    name: "myshelf",
    component: () =>
      import(/* webpackChunkName: "shelf" */ "../components/Myshelf.vue")
  },
  {
    path: "/Searthresult",
    name: "Searthresult",
    component: () =>
      import(/* webpackChunkName: "Searthresult" */ "../components/common/Searthresult.vue")
  },
  {
    path: "/more",
    name: "more",
    component: () =>
      import(/* webpackChunkName: "More" */ "../components/common/More.vue")
  },
  {
    path: "/moreview",
    name: "moreview",
    component: () =>
      import(/* webpackChunkName: "Moreview" */ "../components/common/Moreview.vue")
  },
];

const router = new VueRouter({
  routes
});
//设置选项缓存
router.beforeEach((to,from,next)=>{
if (to.name==('book'||'mulu'||'myshelf'||'Searthresult')) {
  from.meta.keepAlive = true
  to.meta.keepAlive = false
}else if(to.name=='read'&&from.name=='mulu'){
  from.meta.keepAlive = false
  to.meta.keepAlive = false 
}
else if(to.name=='read'&&from.name=='book'){
  from.meta.keepAlive = false
  to.meta.keepAlive = false 
}else if(to.name=='category'){
  from.meta.keepAlive = false
  to.meta.keepAlive = false 
}
else{
  from.meta.keepAlive = true
  to.meta.keepAlive = true
}
next()
})
export default router;
