import InputValidation from 'discourse/models/input-validation';
import { setting } from 'discourse/lib/computed';
import { on, default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Mixin.create({

    maxPhoneNumberLength: 12,
    verificationCodeLength: 6,
    // @on('init')
    // _createMobilePhoneField() {
    //     if (!this.site) { return; }
    //
    //     let userFields = this.site.get('user_fields');
    //     var phoneNumber;
    //     if (userFields) {
    //         phoneNumber = userFields.findBy('name', "Mobile phone");
    //         alert("aa"+phoneNumber.name);
    //         return Ember.Object.create({ value: null, field: phoneNumber });
    //     }
    //
    //     this.set('phoneNumber', phoneNumber);
    // },

    @computed('accountPhoneNumber')
    phoneNumberTypeValidation() {  //for Send Verification Code button
        alert("here");
        var phoneNumber = this.get('accountPhoneNumber');
        var TEN_DIGITS_FORMAT = /\d{3}-\d{3}-\d{4}/;////^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        alert(phoneNumber);
        alert(phoneNumber != '');
        if (phoneNumber != '') {
            alert(TEN_DIGITS_FORMAT.test(phoneNumber));
            if (!TEN_DIGITS_FORMAT.test(phoneNumber)) {
                return InputValidation.create({
                    failed: true,
                    reason: I18n.t('user.phone_number.format_error')
                });
            }
            else {
                return InputValidation.create({
                    ok: true,
                    reason: I18n.t('user.phone_number.ok')
                });
            }

            // If too long
            // if (phoneNumber.replace(/\D/g, '').length > this.get('maxPhoneNumberLength')) { // or /[^0-9]/g
            //     return InputValidation.create({
            //         failed: true,
            //         reason: I18n.t('user.phone_number.too_long')
            //     });
            // }
        }

        else {
            return InputValidation.create({
                failed: true
            });
        }
    },

    @computed('accountPhoneNumber', 'verificationCode', 'verificationCodeValidation')
    phoneNumberExistenceValidation() {
        var phoneNumber = this.get('accountPhoneNumber');
        if (phoneNumber != '') {
            if (this.get('sentSMS') == true){
                return this.get('verificationCodeValidation');
            }
            else{
                return InputValidation.create({
                    failed: true
                });
            }
        }
        else {
            return InputValidation.create({
                ok: true
            });
        }
    },

    @computed('verificationCode')
    verificationCodeValidation() {
        if (this.get('verificationCode') != '' && this.get('verificationCode').length != this.verificationCodeLength){
            return InputValidation.create({
                failed: true,
                reason: I18n.t('user.phone_number.verification_code_length_error', {count: this.verificationCodeLength})
            });
        }

        else if (this.get('sentSMS') == true && this.get('verificationCode')=='') {
            return InputValidation.create({
                failed: true,
                reason: I18n.t('user.phone_number.verification_code_empty')
            });
        }
        else {
            return InputValidation.create({
                ok: true
            });
        }
    }
});
