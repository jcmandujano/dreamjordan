import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'lang-selec',
    loadChildren: () => import('./lang-selec/lang-selec.module').then( m => m.LangSelecPageModule)
  },
  {
    path: 'logreg-select',
    loadChildren: () => import('./logreg-select/logreg-select.module').then( m => m.LogregSelectPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  }

  /*,
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'language-selection',
    loadChildren: () => import('./language-selection/language-selection.module').then( m => m.LanguageSelectionPageModule)
  },
  {
    path: 'plan-detail',
    loadChildren: () => import('./plan-detail/plan-detail.module').then( m => m.PlanDetailPageModule)
  },
  {
    path: 'plan-detail',
    loadChildren: () => import('./plan-detail/plan-detail.module').then( m => m.PlanDetailPageModule)
  },
  {
    path: 'tour-detail',
    loadChildren: () => import('./tour-detail/tour-detail.module').then( m => m.TourDetailPageModule)
  },
  {
    path: 'coupon-validator',
    loadChildren: () => import('./coupon-validator/coupon-validator.module').then( m => m.CouponValidatorPageModule)
  },
  {
    path: 'coupon-generator',
    loadChildren: () => import('./coupon-generator/coupon-generator.module').then( m => m.CouponGeneratorPageModule)
  },
  {
    path: 'my-cart',
    loadChildren: () => import('./my-cart/my-cart.module').then( m => m.MyCartPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  }*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
