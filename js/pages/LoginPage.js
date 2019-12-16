export default class LoginPage {
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
          <div class="card">
            <div class="card-body">
              <form data-id="login-form" class="">
                <div class="form-group row"> <label class="col-2 col-form-label">Логин</label>
                  <div class="col-10">
                    <input type="text" data-id="login-input" class="form-control" placeholder="Введите логин"> </div>
                </div>
                <div class="form-group row"> <label class="col-2 col-form-label">Пароль</label>
                  <div class="col-10">
                    <input type="password" data-id="password-input" class="form-control" placeholder="Введите пароль"> </div>
                </div>
                <button type="submit" class="btn btn-info">Войти</button>
              </form>
            </div>
            <div class="login-links">
              <p class="text-center" >Еще нет аккаунта? <a class="txt-brand" href="user-login.html">
                  <font color="#29aafe">Зарегистрируйтесь</font>
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

        this._errorModal = $('[data-id=error-modal]'); // jquery
        this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');
        this._loginFormEl = this._rootEl.querySelector('[data-id=login-form]');
        this._loginInputEl = this._postCreateFormEl.querySelector('[data-id=login-input]');
        this._passwordInputEl = this._postCreateFormEl.querySelector('[data-id=password-input]');

        this._loginFormEl.addEventListener('submit', evt => {
            evt.preventDefault();
            const data = {
                login: this._loginInputEl.value,
                password: this._passwordInputEl.value,
            };
            this._context.post('/login', JSON.stringify(data), {'Content-Type': 'application/json'},
                text => {
                },
                error => {
                    this.showError(error);
                });
        });
    }

    showError(error) {
        const data = JSON.parse(error);
        const message = this._context.translate(data.message);
        this._errorMessageEl.textContent = message;
        this._errorModal.modal('show');
    }

    destroy() {
        clearTimeout(this._timeout);
    }
}
