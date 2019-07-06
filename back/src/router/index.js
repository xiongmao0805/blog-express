import Vue from 'vue'
import Router from 'vue-router'
import Major from '@/components/Major'
// import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/register'

// import Category from '@/components/category'
// import AddCategory from '@/components/category/Add.vue'
// import ModifyCategory from '@/components/category/Modify.vue'

// import Article from '@/components/article'
// import AddArticle from '@/components/article/Add.vue'
// import ModifyArticle from '@/components/article/Modify.vue'

// import User from '@/components/user'
// import Links from '@/components/links'
// import AddLinks from '@/components/links/Add.vue'
// import ModifyLinks from '@/components/links/Modify.vue'
// import Config from '@/components/config'
// import AddConfig from '@/components/config/Add.vue'
// import ModifyConfig from '@/components/config/Modify.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: Major,
    },
    {
      path: '/admin/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin/register',
      name: 'register',
      component: Register
    },
  ]
});
// children: [
//   {
//     path: '',
//     redirect: { name: 'index' }
//   },
//   {
//     path: 'index',
//     name: 'index',
//     component: Home,
//   },
//   {
//     path: 'category',
//     name: 'category',
//     component: Category,
//     children: [
//       {
//         path: 'add',
//         component: AddCategory
//       },
//       {
//         path: 'modify/:id',
//         component: ModifyCategory
//       }
//     ]
//   },
//   {
//     path: 'article',
//     name: 'article',
//     component: Article,
//     children: [
//       {
//         path: 'add',
//         component: AddArticle
//       },
//       {
//         path: 'modify/:id',
//         component: ModifyArticle
//       }
//     ]
//   },
//   {
//     path: 'comment',
//     name: 'comment',
//     //component  : Comment
//   },
//   {
//     path: 'users',
//     name: 'users',
//     component: User
//   },
//   {
//     path: 'links',
//     name: 'links',
//     component: Links,
//     children: [
//       {
//         path: 'add',
//         component: AddLinks
//       },
//       {
//         path: 'modify/:id',
//         component: ModifyLinks
//       }
//     ]
//   },
//   {
//     path: 'config',
//     name: 'config',
//     component: Config,
//     children: [
//       {
//         path: 'add',
//         component: AddConfig
//       },
//       {
//         path: 'modify/:id',
//         component: ModifyConfig
//       }
//     ]
//   }
// ]
