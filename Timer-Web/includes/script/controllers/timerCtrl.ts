module dthss.timer {
    interface ITimer {
        time: Date;
        running: boolean;
        timer: any;
        setTimeModal: ng.IPromise<void>;

        startTimer(): void;
        stopTimer(): void;
        resetTimer(): void; 
    }

    interface ISetTime {
        countDown: boolean;
        minutes: number;
        seconds: number;
    }

    class timer implements ITimer {
        time: Date;
        running: boolean = false;;
        timer: any;
        private countDown: boolean;
        setTimeModal: ng.IPromise<void> = null;
        modelOptions: Ionic.IModalOptions;
        //setTimeDialog: Ionic.IModal;
        //setTimeValue: Date;
        setTimePopupWindow: ng.IPromise<ISetTime>;
        newTimeData: ISetTime;

        static $inject = ['$interval', '$ionicPopup', '$ionicModal', '$scope'];
        constructor(private $interval: ng.IIntervalService, private $ionicPopup: Ionic.IPopup, private $ionicModel: Ionic.IModal, private $scope: ng.IScope) {
            this.time = this.initialDate();
            //this.setTimeValue = this.initialDate();
            this.newTimeData = <ISetTime>{ minutes: 0, seconds: 0};
            this.countDown = true;
            /*
            this.setTimeModal = $ionicModel.fromTemplateUrl("my-modal.html", <Ionic.IModalOptions>{ animation: 'slide-in-up',  })
                .then((modal: Ionic.IModal) => {
                    this.assignModal(modal);
                });
            */
        }

        startTimer(): void {
            this.running = true;
            this.timer = this.$interval(() => { this.updateTimer(this.time, this.countDown); }, 1000, 0, true);
        };

        stopTimer(): void {
            this.running = false;
            this.$interval.cancel(this.timer);
        };

        resetTimer(): void {
            var tempDate: Date = this.initialDate();
            tempDate.setMinutes(this.newTimeData.minutes);
            tempDate.setSeconds(this.newTimeData.seconds);

            this.time = tempDate;
        };

        private updateTimer(time: Date, countDown: boolean): void {
            if (!this.countDown)
                this.time.setSeconds(this.time.getSeconds() + 1);
            else
                this.time.setSeconds(this.time.getSeconds() - 1);
        }

        showSetTime(): void {
            /*
            // show the modal dialog
            if (this.setTimeModal != null)
                this.setTimeDialog.show();
            */

            //show the popup
            this.setTimePopup();
        }

        setNewTimeValues(setTimeData: ISetTime): void {
            var tempDate: Date = this.initialDate();
            tempDate.setMinutes(setTimeData.minutes);
            tempDate.setSeconds(setTimeData.seconds);

            //this.setTimeValue = tempDate;
            this.time = tempDate; 
            this.countDown = setTimeData.countDown;
        }

        setTimePopup(): void {

            if (this.running)
                return;

            this.newTimeData = <ISetTime>{ countDown : this.countDown, minutes : this.newTimeData.minutes, seconds: this.newTimeData.seconds};
            this.$ionicPopup.show(<Ionic.IPopupOptions> {
                subTitle: "Select Time",
                title: "Reset Time",
                templateUrl: "SetTime.html",
                scope: this.$scope,
                cssClass: "setTimePopup",
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: ((e) => {
                            return this.newTimeData;
                        })
                    }
                ]
            }).then((setTimeData: ISetTime) => {
                if (setTimeData != null)
                    this.setNewTimeValues(setTimeData);
            });
        }

        private initialDate(): Date {
            return new Date(1985, 1, 0, 0, 0, 0, 0);
        }


    }

    angular.module('timerApp').
        controller('timerCtrl', timer);
}