import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import Fuse from 'fuse.js';
import { Subject, debounceTime } from 'rxjs';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { UserBusiness } from 'src/app/core/types/user.structure';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  authId: string | undefined;
  filteredAccessCodesAsString: string = '';
  currentUser: any;
  editMode: boolean = false;
  enterOtpVisible: boolean = false;
  isActionSheetOpen = false;
  accessCodes:(AccessCode|AccessGroup)[] = [
    { name: 'Menu Management Section', type:'divider' },
    { name: 'Add New Menu', accessCode: 'addNewMenu', allowed: false, type:'access' },
    { name: 'Switch Menu', accessCode: 'switchMenu', allowed: false, type:'access' },
    { name: 'Edit Menu', accessCode: 'editMenu', allowed: false, type:'access' },
    {
      name: 'Edit Takeaway Menu',
      accessCode: 'editTakeawayMenu',
      allowed: false,
      type:'access'
    },
    { name: 'Edit Online Menu', accessCode: 'editOnlineMenu', allowed: false, type:'access' },
    { name: 'Edit Dine In Menu', accessCode: 'editDineInMenu', allowed: false, type:'access' },
    { name: 'Products Section', type:'divider' },
    {
      name: 'See Vrajera Categories',
      accessCode: 'seeVrajeraCategories',
      allowed: false,
      type:'access'
    },
    { name: 'See Combos', accessCode: 'seeCombos', allowed: false, type:'access' },
    {
      name: 'See Your Categories',
      accessCode: 'seeYourCategories',
      allowed: false,
      type:'access'
    },
    {
      name: 'See Main Categories',
      accessCode: 'seeMainCategories',
      allowed: false,
      type:'access'
    },
    { name: 'See All Products', accessCode: 'seeAllProducts', allowed: false, type:'access' },
    { name: 'Add New Product', accessCode: 'addNewProduct', allowed: false, type:'access' },
    {
      name: 'Enable Disable Products',
      accessCode: 'enableDisableProducts',
      allowed: false,
      type:'access'
    },
    {
      name: 'Set Taxes On Products',
      accessCode: 'setTaxesOnProducts',
      allowed: false,
      type:'access'
    },
    { name: 'Edit Product', accessCode: 'editProduct', allowed: false, type:'access' },
    { name: 'Can Edit Details', accessCode: 'canEditDetails', allowed: false, type:'access' },
    { name: 'Can Set Printer', accessCode: 'canSetPrinter', allowed: false, type:'access' },
    { name: 'Delete Product', accessCode: 'deleteProduct', allowed: false, type:'access' },
    { name: 'Recommended Section', type:'divider' },
    {
      name: 'Recommended Categories',
      accessCode: 'recommendedCategories',
      allowed: false,
      type:'access'
    },
    {
      name: 'Edit Recommended Category Settings',
      accessCode: 'editRecommendedCategorySettings',
      allowed: false,
      type:'access'
    },
    {
      name: 'Enable Disable Recommended Products',
      accessCode: 'enableDisableRecommendedProducts',
      allowed: false,
      type:'access'
    },
    {
      name: 'Set Taxes On Recommended Products',
      accessCode: 'setTaxesOnRecommendedProducts',
      allowed: false,
      type:'access'
    },
    {
      name: 'Edit Recommended Product',
      accessCode: 'editRecommendedProduct',
      allowed: false,
      type:'access'
    },
    {
      name: 'Delete Recommended Product',
      accessCode: 'deleteRecommendedProduct',
      allowed: false,
      type:'access'
    },
    { name: 'View Categories', accessCode: 'viewCategories', allowed: false, type:'access' },
    {
      name: 'Add View Category',
      accessCode: 'addViewCategory',
      allowed: false,
      type:'access'
    },
    {
      name: 'Edit View Category',
      accessCode: 'editViewCategory',
      allowed: false,
      type:'access'
    },
    {
      name: 'Delete View Category',
      accessCode: 'deleteViewCategory',
      allowed: false,
      type:'access'
    },
    {
      name: 'Enable Disable View Products',
      accessCode: 'enableDisableViewProducts',
      allowed: false,
      type:'access'
    },
    {
      name: 'Set Taxes On View Products',
      accessCode: 'setTaxesOnViewProducts',
      allowed: false,
      type:'access'
    },
    {
      name: 'Edit View Product',
      accessCode: 'editViewProduct',
      allowed: false,
      type:'access'
    },
    {
      name: 'Delete View Product',
      accessCode: 'deleteViewProduct',
      allowed: false,
      type:'access'
    },
    { name: 'Main Categories', accessCode: 'mainCategories', allowed: false, type:'access' },
    {
      name: 'Enable Disable Main Products',
      accessCode: 'enableDisableMainProducts',
      allowed: false,
      type:'access'
    },
    {
      name: 'Set Taxes On Main Products',
      accessCode: 'setTaxesOnMainProducts',
      allowed: false,
      type:'access'
    },
    {
      name: 'Edit Main Product',
      accessCode: 'editMainProduct',
      allowed: false,
      type:'access'
    },
    {
      name: 'Delete Main Product',
      accessCode: 'deleteMainProduct',
      allowed: false,
      type:'access'
    },
    { name: 'Taxes Section', type:'divider' },
    { name: 'Edit Taxes', accessCode: 'editTaxes', allowed: false, type:'access' },
    { name: 'See Taxes', accessCode: 'seeTaxes', allowed: false, type:'access' },
    { name: 'Add New Taxes', accessCode: 'addNewTaxes', allowed: false, type:'access' },
    { name: 'Delete Taxes', accessCode: 'deleteTaxes', allowed: false, type:'access' },
    { name: 'Edit Tax', accessCode: 'editTax', allowed: false, type:'access' },
    { name: 'Discount Section', type:'divider' },
    { name: 'Discount', accessCode: 'discount', allowed: false, type:'access' },
    { name: 'See Discount', accessCode: 'seeDiscount', allowed: false, type:'access' },
    {
      name: 'Add New Discounts',
      accessCode: 'addNewDiscounts',
      allowed: false,
      type:'access'
    },
    { name: 'Delete Discounts', accessCode: 'deleteDiscounts', allowed: false, type:'access' },
    { name: 'Edit Discount', accessCode: 'editDiscount', allowed: false, type:'access' },
    { name: 'Combos Section', type:'divider' },
    { name: 'Combos', accessCode: 'combos', allowed: false, type:'access' },
    { name: 'See Combos', accessCode: 'seeCombos', allowed: false, type:'access' },
    { name: 'Add New Combos', accessCode: 'addNewCombos', allowed: false, type:'access' },
    { name: 'Delete Combos', accessCode: 'deleteCombos', allowed: false, type:'access' },
    { name: 'Edit Combo', accessCode: 'editCombo', allowed: false, type:'access' },
    { name: 'Loyalty Section', type:'divider' },
    { name: 'See Loyalty', accessCode:'seeLoyalty', allowed: false, type:'access'},
    { name: 'Add New Loyalty Settings', accessCode:'addNewLoyaltySettings', allowed: false, type:'access'},
    { name: 'Edit Loyalty Settings', accessCode:'editLoyaltySetting', allowed: false, type:'access'},
    { name: 'Delete Loyalty Settings', accessCode:'deleteLoyaltySetting', allowed: false, type:'access'},
    { name: 'Reports Section', type:'divider' },
    {
      name: 'See Order Summary',
      accessCode: 'seeOrderSummary',
      allowed: false,
      type:'access'
    },
    { name: 'See Sale Summary', accessCode: 'seeSaleSummary', allowed: false, type:'access' },
    { name: 'See Reports', accessCode: 'seeReports', allowed: false, type:'access' },
    { name: 'Tables Section', type: 'divider' },
    { name: 'View Table', accessCode: 'viewTable', allowed: false, type:'access' },
    {
      name: 'Re Arrange Group Order',
      accessCode: 'reArrangeGroupOrder',
      allowed: false,
      type:'access'
    },
    {
      name: 'Settle From Table',
      accessCode: 'settleFromTable',
      allowed: false,
      type:'access'
    },
    { name: 'Add Table', accessCode: 'addTable', allowed: false, type:'access' },
    { name: 'Delete Table', accessCode: 'deleteTable', allowed: false, type:'access' },
    {
      name: 'Add New Takeaway Token',
      accessCode: 'addNewTakeawayToken',
      allowed: false,
      type:'access'
    },
    {
      name: 'Add New Online Token',
      accessCode: 'addNewOnlineToken',
      allowed: false,
      type:'access'
    },
    {
      name: 'Move And Merge Options',
      accessCode: 'moveAndMergeOptions',
      allowed: false,
      type:'access'
    },
    { name: 'Billing Section', type:'divider' },
    { name: 'Punch Kot', accessCode: 'punchKot', allowed: false, type:'access' },
    { name: 'Manage Kot', accessCode: 'manageKot', allowed: false, type:'access' },
    { name: 'Edit Kot', accessCode: 'editKot', allowed: false, type:'access' },
    { name: 'Delete Kot', accessCode: 'deleteKot', allowed: false, type:'access' },
    { name: 'Line Discount', accessCode: 'lineDiscount', allowed: false, type:'access' },
    { name: 'Line Cancel', accessCode: 'lineCancel', allowed: false, type:'access' },
    { name: 'Apply Discount', accessCode: 'applyDiscount', allowed: false, type:'access' },
    { name: 'See Preview', accessCode: 'seePreview', allowed: false, type:'access' },
    { name: 'Split Bill', accessCode: 'splitBill', allowed: false, type:'access' },
    {
      name: 'Set Non Chargeable',
      accessCode: 'setNonChargeable',
      allowed: false,
      type:'access'
    },
    { name: 'Bill Note', accessCode: 'billNote', allowed: false, type:'access' },
    { name: 'Cancel Bill', accessCode: 'cancelBill', allowed: false, type:'access' },
    { name: 'Settle Bill', accessCode: 'settleBill', allowed: false, type:'access' },
    {
      name: 'Write Customer Info',
      accessCode: 'writeCustomerInfo',
      allowed: false,
      type:'access'
    },
    { name: 'Settings Section', type:'divider' },
    { name: 'Settings', accessCode: 'settings', allowed: false, type:'access' },
    { name: 'Update Biller', accessCode: 'updateBiller', allowed: false, type:'access' },
    { name: 'About', accessCode: 'about', allowed: false, type:'access' },
    {
      name: 'Read About Settings',
      accessCode: 'readAboutSettings',
      allowed: false,
      type:'access'
    },
    {
      name: 'Set Printer Settings',
      accessCode: 'setPrinterSettings',
      allowed: false,
      type:'access'
    },
    {
      name: 'Change About Settings',
      accessCode: 'changeAboutSettings',
      allowed: false,
      type:'access'
    },
    {
      name: 'Business Settings',
      accessCode: 'businessSettings',
      allowed: false,
      type:'access'
    },
    {
      name: 'Read Business Settings',
      accessCode: 'readBusinessSettings',
      allowed: false,
      type:'access'
    },
    { name: 'Switch Modes', accessCode: 'switchModes', allowed: false, type:'access' },
    { name: 'Change Config', accessCode: 'changeConfig', allowed: false, type:'access' },
    { name: 'Change Printer', accessCode: 'changePrinter', allowed: false, type:'access' },
    { name: 'User Management', type:'divider' },
    { name: 'Account Settings', accessCode: 'accountSettings', allowed: false, type:'access' },
    {
      name: 'Read Account Settings',
      accessCode: 'readAccountSettings',
      allowed: false,
      type:'access'
    },
    { name: 'Add Account', accessCode: 'addAccount', allowed: false, type:'access' },
    { name: 'Remove Account', accessCode: 'removeAccount', allowed: false, type:'access' },
    { name: 'Payment Method Management', type:'divider' },
    { name: 'Payment Methods', accessCode: 'paymentMethods', allowed: false, type:'access' },
    { name: 'New Method', accessCode: 'newMethod', allowed: false, type:'access' },
    { name: 'Edit Method', accessCode: 'editMethod', allowed: false, type:'access' },
    { name: 'Delete Method', accessCode: 'deleteMethod', allowed: false, type:'access' },
    { name: 'Advanced Settings', type:'divider' },
    {
      name: 'Advanced Settings',
      accessCode: 'advancedSettings',
      allowed: false,
      type:'access'
    },
    { name: 'Multiple Discounts', accessCode:'multipleDiscounts', allowed: false, type:'access'},
    { name: 'General Settings', accessCode: 'generalSettings', allowed: false, type:'access' },
    { name: 'See History', accessCode: 'seeHistory', allowed: false, type:'access' },
  ];
  filteredAccessCodes: (AccessCode|AccessGroup)[] = this.accessCodes;
  fuseInstance: Fuse<(AccessCode|AccessGroup)> =
    new Fuse(this.accessCodes, { keys: ['name', 'accessCode'] });
  accessForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    accessType: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(role|custom)$/),
    ]),
    role: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    confirmPassword: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
  });
  public actionSheetButtons = [
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Share',
      data: {
        action: 'share',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  checkingUsername: boolean = false;
  userNameAvailable: 'invalid' | 'available' | 'unavailable' | 'checking' =
    'checking';
  checkUsername: Subject<string | number | null | undefined> = new Subject<
    string | number | null | undefined
  >();
  searchSubject: Subject<string | null | undefined> = new Subject<
    string | null | undefined
  >();
  currentBusiness: UserBusiness | undefined;
  constructor(
    private databaseService: DatabaseService,
    private dataProvider: DataProvider,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private loader: LoadingController,
    private alertify: AlertsAndNotificationsService,
    private router:Router
  ) {
    this.dataProvider.currentBusiness.subscribe((loadedBusiness) => {
      this.currentBusiness = loadedBusiness;
      this.activatedRoute.params.subscribe((params) => {
        if (params['userId']) {
          if (params['userId'] == 'new') {
            this.editMode = false;
          } else {
            this.databaseService
              .getUsers(loadedBusiness.businessId)
              .then((users) => {
                this.currentUser = users.find(
                  (user: any) => user.id == params['userId']
                );
                console.log('Current user', this.currentUser);
                this.editMode = true;
                this.accessForm.patchValue(this.currentUser);
                if (this.currentUser.propertiesAllowed){
                  this.currentUser.propertiesAllowed.forEach((prop:any) => {
                    let code = this.accessCodes.find(
                      (accessCode) => accessCode.type == 'access' && prop == accessCode.accessCode
                    );
                    if (code && code.type =='access') {
                      code.allowed = true;
                    }
                  });
                  // merge the name of the this.currentUser.propertiesAllowed with comma separated
                  this.filteredAccessCodesAsString = this.currentUser.propertiesAllowed.map((prop:any)=>{
                    let code = this.accessCodes.find(
                      (accessCode) => accessCode.type == 'access' && prop == accessCode.accessCode
                    );
                    if (code && code.type =='access') {
                      return code.name;
                    }
                    return '';
                  }).join(', ');
                } else if(this.currentUser.accessType == 'role'){
                  this.accessForm.get('role')?.setValue(this.currentUser.role);
                }
              });
          }
        }
      });
    });
    this.checkUsername.subscribe((value) => {
      this.checkingUsername = true;
    });
    this.checkUsername.pipe(debounceTime(1000)).subscribe((value) => {
      // check if the username field is valid or not
      if (this.accessForm.get('username')?.invalid) {
        this.checkingUsername = false;
        this.userNameAvailable = 'invalid';
        return;
      }
      this.checkingUsername = true;
      if (value == null || value == undefined || value == '') {
        this.checkingUsername = false;
        this.userNameAvailable = 'invalid';
        // mark as touched and invalid
        this.accessForm.get('username')?.markAsTouched();
        this.accessForm.get('username')?.setErrors({ invalid: true });
        return;
      }
      this.authService
        .checkUsernameAvailability(value.toString())
        .then((result: any) => {
          this.checkingUsername = false;
          this.userNameAvailable = result.data['stage'];
          console.log('Stage', result);
        })
        .catch((error) => {
          this.checkingUsername = false;
          this.userNameAvailable = 'invalid';
        });
    });
    this.searchSubject.pipe(debounceTime(600)).subscribe((value) => {
      if (value) {
        this.filteredAccessCodes = this.fuseInstance
          .search(value)
          .map((result) => result.item).filter((item)=>item.type=='access');
      }
    });
  }

  ngOnInit() {
  }

  search(event: any) {}

  async submit() {
    // three possible conditions
    // existing user
    // new user
    // invalid details
    if (this.accessForm.invalid) {
      this.alertify.presentToast('Please fill all the details');
      return;
    }
    if (this.editMode && this.currentBusiness) {
      // update user
      console.log('Updating user', this.accessForm.value);
      let data = this.accessForm.value;
      delete data['confirmPassword']
      delete data['password']
      delete data['email']
      this.databaseService.updateUser(this.accessForm.value,this.currentBusiness.businessId).then((result) => {
        this.alertify.presentToast('User updated successfully');
        this.router.navigate(['admin','settings','users']);
      }).catch((error)=>{
        console.log('Error',error);
      })
    } else {
      if (this.userNameAvailable == 'available') {
        // create a new user
        if (
          this.accessForm.value.password !=
          this.accessForm.value.confirmPassword
        ) {
          this.alertify.presentToast('Passwords do not match');
          return;
        } else if (this.accessForm.value.password.length < 6) {
          this.alertify.presentToast(
            'Password should be at least 6 characters long'
          );
          return;
        } else if (this.accessForm.value.password.length > 20) {
          this.alertify.presentToast(
            'Password should be less than 20 characters long'
          );
          return;
        } else if (this.accessForm.value.username.length < 3) {
          this.alertify.presentToast(
            'Username should be at least 3 characters long'
          );
          return;
        } else if (this.accessForm.value.username.length > 20) {
          this.alertify.presentToast(
            'Username should be less than 20 characters long'
          );
          return;
        } else if (this.accessForm.value.username.includes(' ')) {
          this.alertify.presentToast('Username should not contain spaces');
          return;
        }
        let access: any = {
          accessType: this.accessForm.get('accessType')?.value,
          lastUpdated: Timestamp.now(),
        };
        if (this.accessForm.get('accessType')?.value == 'role') {
          access['role'] = this.accessForm.get('role')?.value;
        } else {
          access['propertiesAllowed'] = this.accessCodes
            .filter((accessCode) => {
              return accessCode.type=='access' && accessCode.allowed;
            })
            .map((accessCode) => {
              if (accessCode.type=='access')
              return accessCode.accessCode;
              else return '';
            });
        }
        console.log('Access', access);
        let loader = await this.loader.create({ message: 'Creating User' });
        loader.present();
        this.authService
          .signUpWithUserAndPassword(
            this.accessForm.get('username')?.value,
            this.accessForm.get('password')?.value,
            {
              email: this.accessForm.get('email')?.value,
              phone: this.accessForm.get('phone')?.value,
              business: {
                ...this.currentBusiness!,
                access: access,
              },
            }
          )
          .then((result: any) => {
            console.log('Result', result);
            let newUserData: any = {
              updatedBy: this.dataProvider.currentUser?.uid,
              username: result.uid,
              ...result.business[0].access,
              lastUpdated: Timestamp.now(),
            };
            console.log("Adding new user",newUserData);
            this.databaseService.addUser(newUserData,this.currentBusiness!.businessId);
            this.router.navigate(['admin','settings','users']);
          })
          .catch((error) => {
            this.alertify.presentToast(error.message);
            console.log('Error', error);
          })
          .finally(() => {
            loader.dismiss();
          });
      } else if (this.userNameAvailable == 'unavailable') {
        // invite to the user will be sent and then otp verification will happen.
        let props: any = {
          username: this.accessForm.get('username')?.value,
          businessId: this.currentBusiness!.businessId,
          access: {
            accessType: this.accessForm.get('accessType')?.value,
            lastUpdated: Timestamp.now(),
            updatedBy: 'system',
          },
        };
        if (this.accessForm.get('accessType')?.value == 'role') {
          props['access']['role'] = this.accessForm.get('role')?.value;
        } else {
          props['access']['propertiesAllowed'] = this.accessCodes
            .filter((accessCode) => {
              return accessCode.type=='access' && accessCode.allowed;
            })
            .map((accessCode) => {
              if (accessCode.type=='access')
              return accessCode.accessCode;
              else return '';
            });
        }
        console.log('Props', props);
        let loader = await this.loader.create({ message: 'Sending Invite' });
        loader.present();
        this.authService
          .addExistingUser(props.username, props.businessId, props.access)
          .then((result: any) => {
            console.log('Result', result);
            if (result.data.status == 'success') {
              this.alertify.presentToast(result.data.message);
              this.enterOtpVisible = true;
              this.authId = result.data.authId;
            } else {
              this.alertify.presentToast(result.data.message);
            }
          })
          .catch((error) => {
            this.alertify.presentToast('Error sending invite');
            console.log('Error', error);
          })
          .finally(() => {
            loader.dismiss();
          });
      }
    }
  }

  verifyOtp(otp: string | number | null | undefined) {
    if (this.authId && otp) {
      this.authService
        .verifyOtpExistingUser(
          this.accessForm.get('username')?.value,
          otp.toString(),
          this.authId
        )
        .then((result: any) => {
          console.log('Result', result);
          if (result.data.status == 'success') {
            this.alertify.presentToast(result.data.message);
            this.enterOtpVisible = false;
          } else {
            this.alertify.presentToast(result.data.message);
          }
        })
        .catch((error) => {
          this.alertify.presentToast('Error verifying invite');
          console.log('Error', error);
        });
    } else {
      this.alertify.presentToast('Old request, Cannot process.');
    }
  }
}

export interface AccessCode { name: string; accessCode: string; allowed: boolean, type:'access' }
export interface AccessGroup { name: string; type:'divider' }