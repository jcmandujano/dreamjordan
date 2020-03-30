import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes =[
   {
     path: 'tabs',
     component:TabsPage,
     children : [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'countries',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../countries/countries.module').then( m => m.CountriesPageModule)
          }
        ]
      },
      {
        path: 'dreamjordan-plans',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../dreamjordan-plans/dreamjordan-plans.module').then( m => m.DreamjordanPlansPageModule)
          }
        ]
      },
      {
        path: 'my-purchases',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../my-purchases/my-purchases.module').then( m => m.MyPurchasesPageModule)
          }
        ]
      },
      {
        path: 'country-detail/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../country-detail/country-detail.module').then( m => m.CountryDetailPageModule)
          }
        ]
      },
      {
        path: 'tour-detail/:idpais/:nid',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../tour-detail/tour-detail.module').then( m => m.TourDetailPageModule)
          }
        ]
      },
      {
        path: 'coupon-validator',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../coupon-validator/coupon-validator.module').then( m => m.CouponValidatorPageModule)
          },
        ]
      },
      {
        path: 'dreamjordan-detail/:id',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../dreamjordan-detail/dreamjordan-detail.module').then( m => m.DreamjordanDetailPageModule)
          }
        ]
      },
      {
        path: 'my-cart',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../my-cart/my-cart.module').then( m => m.MyCartPageModule)
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../about/about.module').then( m => m.AboutPageModule)
          }
        ]
      },
      {
        path: 'faq',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../faqs/faqs.module').then( m => m.FAQsPageModule)
          }
        ]
      },
      {
        path: 'contact',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../contact/contact.module').then( m => m.ContactPageModule)
          }
        ]
      },
      {
        path: 'my-account',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../my-account/my-account.module').then( m => m.MyAccountPageModule)
          }
        ]
      },
      {
        path: 'login',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../login/login.module').then( m => m.LoginPageModule)
          }
        ]
      }
      ,
      {
        path: 'registro',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../register/register.module').then( m => m.RegisterPageModule)
          }
        ]
      }
     ]
   },
    {
     path:'',
     redirectTo: 'tabs/home',
     pathMatch:'full'
    }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
