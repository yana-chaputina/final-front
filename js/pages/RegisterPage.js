export default class RegisterPage {
    constructor(context) {
        this._context = context;
        this._rootEl = context.rootEl();

    }

    init() {
        this._rootEl.innerHTML = `
         <div class="py-5"></div>
  <div class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
        <div class="alert alert-info" role="alert" style="display: none" data-id="alert">
            <button type="button" class="close" data-dismiss="alert">×</button>
            <h4 class="alert-heading">Вы зарегистрированы!</h4>
          </div>
          <div class="card">
            <div class="card-body">
              <form data-id="register-form" class="">
              <input type="hidden" data-id="id-input" value="0">
                <div class="form-group row"> <label class="col-2 col-form-label">Имя</label>
                  <div class="col-10">
                    <input type="text" data-id="name-input" class="form-control" placeholder="Введите имя"> </div>
                </div>
                <div class="form-group row"> <label class="col-2 col-form-label">Email</label>
                  <div class="col-10">
                    <input type="email" data-id="email-input" class="form-control" placeholder="Введите адрес электронной почты"> </div>
                </div>
                <div class="form-group row"> <label class="col-2 col-form-label">Логин</label>
                  <div class="col-10">
                    <input type="text" data-id="login-input" class="form-control" placeholder="Введите логин"> </div>
                </div>
                <div class="form-group row"> <label class="col-2 col-form-label">Пароль</label>
                  <div class="col-10">
                    <input type="password" data-id="password-input" class="form-control" placeholder="Введите пароль" minlength="4"> </div>
                </div>
                <div class="form-group row"> <label class="col-2 col-form-label">Фото</label>
                  <div class="col-10">
                <div class="form-group">
                    <div class="custom-file">
                      <input type="hidden" data-id="photo-name-input">
                      <input type="file" data-id="photo-input" class="custom-file-input" id="photo-input">
                      <label class="custom-file-label" for="photo-input">Выберите файл</label>
                    </div>
                    </div>
                  </div>
                <button type="submit" class="btn btn-info">Зарегистрироваться</button>
              </form>
            </div>
            <div class="login-links">
              <p class="text-center" >Есть аккаунт? <a class="txt-brand" href="/">
                  <font color="#29aafe">Войти</font>
                </a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" data-id="error-modal" tabindex="-1" >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Ошибка!</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div data-id="error-message" class="modal-body">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
    `;
        this._alertEl = $('[data-id="alert"]');
        this._errorModal = $('[data-id=error-modal]');
        this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');
        this._registerFormEl = this._rootEl.querySelector('[data-id=register-form]');
        this._nameInputEl = this._registerFormEl.querySelector('[data-id=name-input]');
        this._emailInputEl = this._registerFormEl.querySelector('[data-id=email-input]');
        this._loginInputEl = this._registerFormEl.querySelector('[data-id=login-input]');
        this._passwordInputEl = this._registerFormEl.querySelector('[data-id=password-input]');
        this._idInputEl = this._registerFormEl.querySelector('[data-id=id-input]');
        this._photoNameInputEl = this._registerFormEl.querySelector('[data-id=photo-name-input]');
        this._photoInputEl = this._registerFormEl.querySelector('[data-id=photo-input]');

        this._photoInputEl.addEventListener('change', evt => {

            const [file] = Array.from(evt.currentTarget.files);
            const formData = new FormData();
            formData.append('file', file);
            this._context.post('/files/multipart', formData, {},
                text => {
                    const data = JSON.parse(text);
                    this._photoNameInputEl.value = data.name;
                },
                error => {
                    this.showError(error);
                });
        });


        this._registerFormEl.addEventListener('submit', evt => {
            evt.preventDefault();
            const data = {
                id: Number(this._idInputEl.value),
                name: this._nameInputEl.value,
                email: this._emailInputEl.value,
                username: this._loginInputEl.value,
                password: this._passwordInputEl.value,
                photo: this._photoNameInputEl.value || null
            };
            this._context.post('/users', JSON.stringify(data), {'Content-Type': 'application/json'},
                text => {
                    this._idInputEl.value = 0;
                    this._nameInputEl.value = '';
                    this._emailInputEl.value = '';
                    this._loginInputEl.value = '';
                    this._passwordInputEl.value = '';
                    this._photoInputEl.value = '';

                    this._alertEl.show();
                },
                error => {
                    this.showError(error);
                });
        });
    }

    showError(error) {
        const data = JSON.parse(error);
        let message = this._context.translate(data.message);
        if(data.errors) {
            message+=":";
            for (var key in data.errors) {
                
               message=message+' '+this._context.translate(key)+':'+this._context.translate(data.errors[key]);
            }
        }
        this._errorMessageEl.textContent = message;
        this._errorModal.modal('show');
    }

    destroy() {
    }
}
