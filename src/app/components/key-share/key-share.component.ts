import { Component, Input } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { BehaviorSubject } from 'rxjs'
import { ApiService } from 'src/app/services/api/api.service'
import { Uint8PublicKeyShareSync } from 'src/app/types/KeyShareSync'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-key-share',
  templateUrl: './key-share.component.html',
  styleUrls: ['./key-share.component.scss']
})
export class KeyShareComponent {
  // _keyShare: SealerPublicKeyShare
  public busy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private readonly apiService: ApiService, private readonly alertController: AlertController) {}
  @Input()
  keyShare: Uint8PublicKeyShareSync

  async sync() {
    this.busy$.next(true)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Prompt!',
      message: 'Please enter the Vote ID to broadcast the public key share',
      inputs: [
        {
          name: 'vote',
          type: 'text',
          placeholder: 'Vote ID'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.busy$.next(false)
          }
        },
        {
          text: 'Ok',
          handler: async (data) => {
            this.apiService
              .postKeygen(this.keyShare, data.vote)
              .then((result) => {
                this.busy$.next(false)
                this.showSweetAlert(result.data)
              })
              .catch((err) => {
                this.showError(err)
                this.busy$.next(false)
              })
          }
        }
      ]
    })

    await alert.present()
  }

  private async showSweetAlert(message: string): Promise<void> {
    Swal.fire({
      title: 'Success',
      text: `${message}`,
      icon: 'success'
    })
  }

  private async showError(message: string): Promise<void> {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${message}`
    })
  }
}
