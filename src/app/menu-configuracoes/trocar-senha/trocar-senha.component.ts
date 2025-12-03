import { TrocarSenhaService } from './trocar-senha.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogModule, PoDialogService, PoDividerModule, PoMenuPanelItem, PoMenuPanelModule, PoPageAction, PoPageModule, PoRadioGroupOption, PoToolbarModule, PoNotificationService } from '@po-ui/ng-components';
import { PoPageChangePassword, PoPageChangePasswordModule } from '@po-ui/ng-templates';

@Component({
  selector: 'app-trocar-senha',
  standalone: true,
  imports: [
    PoPageModule,
    PoToolbarModule,
    PoMenuPanelModule,
    PoDividerModule,
    PoPageChangePasswordModule,
  ],
  templateUrl: './trocar-senha.component.html',
  styleUrl: './trocar-senha.component.css'
})
export class TrocarSenhaComponent {

  constructor(private router: Router, private poDialog: PoDialogService,
    private TrocarSenhaService: TrocarSenhaService,
    private poNotification: PoNotificationService
  ) {

  }
  public readonly componentsSizeOptions: Array<PoRadioGroupOption> = [
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' }
  ];

  async onSubmit(formData: PoPageChangePassword) {
    const userName = sessionStorage.getItem('mrUsuario');
    const payload = {
      username: userName,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }

    try {
      const response = await this.TrocarSenhaService.changePassword(payload);
      //console.log(response)
      if (response.code === 200) {
        this.router.navigate(['/login']);
        this.poNotification.information('Senha alterada com sucesso, faça novo login.')
      } else {
        this.poNotification.error(response.message);
      }

    } catch (error: any) {
      this.poNotification.error(error);
    }


  }

}
