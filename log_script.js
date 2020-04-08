const clockInClockOut = {
    loginBtn: document.querySelector('.quickpunch-buttons .login-btn a'),
    logoutBtn: document.querySelector('.quickpunch-buttons .logout-btn a'),
    LOGIN_ACTION: 'login',
    LOGOUT_ACTION: 'logout',
    action: this.LOGIN_ACTION,

    init() {
        const self = this;
        self.loginBtn.addEventListener('click', function(){
            self.action = self.LOGIN_ACTION;
            self.customizeForm();
        });

        self.logoutBtn.addEventListener('click', function(){
            self.action = self.LOGOUT_ACTION;
            self.customizeForm();
        });
    },

    customizeForm() {
        const self = this;
        let modalInterval = setInterval(loginModal, 1000);

        function loginModal() {
            console.log('checking login modal...');
            const submitLogin = document.getElementById('edit-submit');
            if (submitLogin) {
                console.log('login modal loaded');
                clearInterval(modalInterval);

                self.prefillLoginFields();
                self.addCustomButton();
            }
        }
    },

    prefillLoginFields() {
        document.getElementById('edit-username').value = config.username;
        document.getElementById('edit-password').value = config.password ? config.password : '';
    },

    addCustomButton() {
        const self = this;
        const submitButton = document.getElementById('edit-submit');
        submitButton.setAttribute('style', 'display: none');
        const cloneInput = submitButton.cloneNode(true);

        cloneInput.setAttribute('id', 'edit-submit-clone');
        cloneInput.setAttribute('type', 'button');
        cloneInput.setAttribute('name','op-clone');
        cloneInput.setAttribute('style', 'padding: 10px 20px;color: #fff; cursor: pointer;');

        cloneInput.addEventListener('click', self.processLoginAction);

        document.getElementById('logform').insertBefore(cloneInput, submitButton);
    },

    processLoginAction() {
        const self = clockInClockOut;

        const isIn = self.action === self.LOGIN_ACTION;
        const submitButton = document.getElementById('edit-submit');

        self.triggerMouseEvent(submitButton, 'mousedown');

        if (submitButton.classList.contains('progress-disabled')) {
            const requestInterval = setInterval(checkResponse, 1000);

            function checkResponse() {
                console.log('Waiting for response...');
                const messageResponse = document.getElementById('colorbox').querySelector('.messages');
                if (!submitButton.classList.contains('progress-disabled') && 
                    messageResponse
                ) {
                    console.log('Request done');
                    clearInterval(requestInterval);

                    if (messageResponse.classList.contains('messages--status')) {
                        self.updateSlackChannel();

                        if (config.slackProfileToken) {
                            self.updateSlackProfileStatus();
                        }
                    }
                    
                }
            }
        }
    },

    updateSlackChannel() {
        const self = clockInClockOut;
        const isIn = self.action === self.LOGIN_ACTION;

        return fetch(config.slackChannelUrl, {
            method: 'POST',
            body: JSON.stringify({
                text: isIn ? config.name + ' has logged in.' : config.name + ' has logged out.'
            })
        });      
    },

    updateSlackProfileStatus() {
        const self = clockInClockOut;
        const presence = self.action === self.LOGIN_ACTION ? 'auto' : 'away';
        const apiUrl = `${config.apiSlackProfilePresenceUrl}?token=${config.slackProfileToken}&presence=${presence}`;

        // fetch method seems not working so traditional ajax
        const xhr = new XMLHttpRequest();
        xhr.open('POST', apiUrl);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                const responseText = JSON.parse(xhr.responseText);
            }
        };
        xhr.send();
 
    },

    /**
    * Programmatically trigger event
    *
    * node - the element node
    * eventType - mouseover|mousedown|mouseup|click
    */
    triggerMouseEvent(node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
};

clockInClockOut.init();