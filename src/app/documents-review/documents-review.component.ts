
import { ApiDocumentsreviewService } from './api-documentsreview.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PoDividerModule, PoFieldModule, PoLoadingModule, PoNotificationModule, PoNotificationService, PoPageModule, PoWidgetComponent, PoWidgetModule } from '@po-ui/ng-components';


@Component({
    selector: 'app-documents-review',
    imports: [PoPageModule,
        PoFieldModule,
        PoDividerModule,
        PoWidgetModule,
        FormsModule,
        PoNotificationModule,
        PoLoadingModule
    ],
    templateUrl: './documents-review.component.html',
    styleUrl: './documents-review.component.css'
})


export class DocumentsReviewComponent implements OnInit {


  @ViewChild('avalaibleDocs', { static: true }) divElement!: ElementRef;

  hiddenList: Array<boolean> = Array(20).fill(true);
  documentNames: Array<string> = Array(20).fill('');
  orderNumber: string = '';
  orderPartNumber: string = '';
  orderIssueDate: string = '';
  orderCloseDate: string = ''
  orderCustomer: string = ''
  availableDocumentsContent: string = ''
  documentsContent: string = ''
  isHideLoading: boolean = true;


  productionId: string = ''
  constructor(private route: ActivatedRoute,
    private ApiDocumentsreviewService: ApiDocumentsreviewService,
    private poNotification: PoNotificationService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.route.queryParams.subscribe(queryParams => {
      this.productionId = queryParams['productionId'];
    })

    this.isHideLoading = false;
    let response: any = await this.ApiDocumentsreviewService.getOrderDocuments(this.productionId);
    this.isHideLoading = true;
    if (typeof response === "string") {
      this.poNotification.error(response);
    } else {
      if ("code" in response) {
        if (response.code === "500") {
          this.poNotification.error(response.message)
        } else {
          if (response.code === "200") {

            this.orderNumber = response.orderNumber;
            this.orderPartNumber = response.orderPartNumber;
            this.orderIssueDate = response.orderIssueDate;
            this.orderCloseDate = response.orderCloseDate;
            this.orderCustomer = response.orderCustomer;

            //available documents:
            this.availableDocumentsContent = '';
            this.documentsContent = '';
            for (let i = 0; i < response.orderDocuments.length; i++) {
              this.hiddenList[i] = false;
              this.documentNames[i] = response.orderDocuments[i];
            }

          } else {
            this.poNotification.information(response.message)
          }
        }
      }
    }

  }

  async downloadDocument(documentIndex: number) {

    await this.ApiDocumentsreviewService.downloadDocument(this.productionId, this.documentNames[documentIndex]);


  }
}
