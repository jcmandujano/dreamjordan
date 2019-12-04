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
        path: 'country-detail',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../country-detail/country-detail.module').then( m => m.CountryDetailPageModule)
          }
        ]
      },
      {
        path: 'tour-detail',
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
        path: 'dreamjordan-detail',
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
      }
     ]
   },
    {
     path:'',
     redirectTo: '/tabs/home',
     pathMatch:'full'
    }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
