getUser();

//Tạo mảng validateTaiKhoans để dùng cho validate trường hợp không dc đặt trùng tài khoản trước khi add user
//Tạo mảng validateTaiKhoanEdits để dùng cho validate trường hợp không dc đặt trùng tài khoản trước khi edit user
let validateTaiKhoans = [];
let validateTaiKhoanEdits = [];

//function getUser để lấy dữ liệu từ API
function getUser() {
  apiGetUser()
    .then((response) => {
      //Tạo mảng taiKhoans chỉ chứa các tài khoản rồi gán cho mảng validateTaiKhoans để kiểm tra trường hợp validate có trùng tài khoản ko
      let taiKhoans = response.data.map((user) => {
        return user.taiKhoan;
      });
      validateTaiKhoans = [...taiKhoans];

      //Duyệt qua danh sách người dùng và tạo các đối tượng user
      let users = response.data.map((user) => {
        return new User(
          user.id,
          user.taiKhoan,
          user.hoTen,
          user.matKhau,
          user.email,
          user.loaiND,
          user.ngonNgu,
          user.moTa,
          user.hinhAnh
        );
      });

      //Hiện thị ra bảng
      display(users);
    })

    .catch((error) => {
      console.log(error);
    });
}

//function addUser request API để thêm người dùng
function addUser(user) {
  //Kiểm tra thông tin input có hợp lệ hay ko, nếu ko thì dừng hàm
  let form = validateForm();
  if (!form) {
    return;
  }

  apiAddUser(user)
    .then(() => {
      getUser();
    })
    .catch((error) => {
      console.log(error);
    });
}

//function deleteUser request API để xóa người dùng
function deleteUser(userId) {
  apiDeleteUser(userId)
    .then(() => {
      getUser();
    })
    .catch((error) => {
      console.log(error);
    });
}

// function updateUser request API để cập nhật người dùng
function updateUser(userId, user) {
  //Kiểm tra thông tin input có hợp lệ hay ko, nếu ko thì dừng hàm
  let form = validateFormEdit();
  if (!form) {
    return;
  }

  apiUpdateUser(userId, user)
    .then(() => {
      //Sau khi update xong thông tin gọi lại hàm getUser để hiển thị lại
      getUser();
    })
    .catch((error) => {
      console.log(error);
    });
}

//===========================================================

// hàm display để hiển thị ra bảng
function display(users) {
  let output = users.reduce((result, user, index) => {
    return (
      result +
      `
        <tr>
            <td>${index + 1}</td>
            <td>${user.taiKhoan}</td>
            <td>${user.matKhau}</td>
            <td>${user.hoTen}</td>
            <td>${user.email}</td>
            <td>${user.ngonNgu}</td>
            <td>${user.loaiND}</td>
            <td>
                <button class="btn btn-success" data-type="edit" data-id="${
                  user.id
                }" data-toggle="modal"
                data-target="#myModal">Sửa</button>

                <button class="btn btn-danger" data-type="delete" data-id="${
                  user.id
                }">Xóa</button>
            </td>
        </tr>
        `
    );
  }, "");

  dom("#tblDanhSachNguoiDung").innerHTML = output;
}

// function DOM
function dom(selector) {
  return document.querySelector(selector);
}

// function Reset form
function resetForm() {
  dom("#TaiKhoan").value = "";
  dom("#HoTen").value = "";
  dom("#MatKhau").value = "";
  dom("#Email").value = "";
  dom("#HinhAnh").value = "";
  dom("#loaiNguoiDung").value = "";
  dom("#loaiNgonNgu").value = "";
  dom("#MoTa").value = "";
}

//===========================================================

//Lắng nghe sự kiện click của button Thêm Mới
dom("#btnThemNguoiDung").addEventListener("click", () => {
  dom(".modal-title").innerHTML = "Thêm người dùng";
  dom(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
    <button class="btn btn-success" data-type="add">Thêm</button>
    `;

  //Sửa lại input Tài khoản để thay đổi thuộc tính oninput thành validateTaiKhoan()
  dom("#divTaiKhoan").innerHTML = `
  <label>Tài khoản</label>
  <input
    id="TaiKhoan"
    class="form-control"
    placeholder="Nhập vào tài khoản"
    oninput="validateTaiKhoan()"
  />
  <span id="spanTaiKhoan"></span>
  `;

  //reset form
  resetForm();
});

dom(".modal-footer").addEventListener("click", (evt) => {
  let elementType = evt.target.getAttribute("data-type");

  //DOM lấy thông tin input
  let id = dom("#userId").value;
  let taiKhoan = dom("#TaiKhoan").value;
  let hoTen = dom("#HoTen").value;
  let matKhau = dom("#MatKhau").value;
  let email = dom("#Email").value;
  let hinhAnh = dom("#HinhAnh").value;
  let loaiND = dom("#loaiNguoiDung").value;
  let ngonNgu = dom("#loaiNgonNgu").value;
  let moTa = dom("#MoTa").value;

  //Tạo object user từ lớp đối tượng User
  let user = new User(
    null,
    taiKhoan,
    hoTen,
    matKhau,
    email,
    loaiND,
    ngonNgu,
    moTa,
    hinhAnh
  );

  if (elementType === "add") {
    addUser(user);
  }
  if (elementType === "update") {
    updateUser(id, user);
  }
});

//Ủy quyền lắng nghe sự kiện click của các button Xóa cho thẻ tbody
dom("#tblDanhSachNguoiDung").addEventListener("click", (evt) => {
  // truy cập vào thẻ gốc phát sinh ra sự kiện bằng evt.target

  //Dùng hàm getAttribute để lấy thông tin dc thêm vào các thẻ button
  let id = evt.target.getAttribute("data-id");
  let elType = evt.target.getAttribute("data-type");

  if (elType === "delete") {
    deleteUser(id);
  }

  if (elType === "edit") {
    //Chỉnh sửa tiêu đề cho cập nhật
    dom(".modal-title").innerHTML = "Cập nhật người dùng";

    //Sửa lại input Tài khoản để thay đổi thuộc tính oninput thành validateTaiKhoanEdit()
    dom("#divTaiKhoan").innerHTML = `
    <label>Tài khoản</label>
    <input
      id="TaiKhoan"
      class="form-control"
      placeholder="Nhập vào tài khoản"
      oninput="validateTaiKhoanEdit()"
    />
    <span id="spanTaiKhoan"></span>
    `;

    dom(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
    <button class="btn btn-success" data-type="update">Cập nhật</button>
    `;
    //Call API để lấy thông tin của người dùng điền vào input
    apiGetUserById(id)
      .then((response) => {
        let user = response.data;
        //Điền thông tin lên các input
        dom("#userId").value = user.id; //Thêm id vào ô input ẩn
        dom("#TaiKhoan").value = user.taiKhoan;
        dom("#HoTen").value = user.hoTen;
        dom("#MatKhau").value = user.matKhau;
        dom("#Email").value = user.email;
        dom("#HinhAnh").value = user.hinhAnh;
        dom("#loaiNguoiDung").value = user.loaiND;
        dom("#loaiNgonNgu").value = user.ngonNgu;
        dom("#MoTa").value = user.moTa;

        //Gán mảng validateTaiKhoanEdits bằng mảng validateTaiKhoans bỏ đi tài khoản của user dc nhấn nút "sửa" (edit)
        validateTaiKhoanEdits = validateTaiKhoans.filter((taiKhoan) => {
          return taiKhoan !== user.taiKhoan;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

//===========================================================

//Validation

//Hàm kiểm tra Tài khoản có hợp lệ hay ko
function validateTaiKhoan() {
  //DOM
  let taiKhoan = dom("#TaiKhoan").value;
  let spanEl = dom("#spanTaiKhoan");
  spanEl.style.color = "red";
  //Xét trường hợp tài khoản có để trống hay ko
  if (!taiKhoan) {
    spanEl.innerHTML = "Tài khoản không được để trống";
    return false;
  }
  //
  for (let i = 0; i < validateTaiKhoans.length; i++) {
    if (taiKhoan === validateTaiKhoans[i]) {
      spanEl.innerHTML = "Tài khoản không được trùng nhau";
      return false;
    }
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Tài khoản có hợp lệ hay ko
function validateTaiKhoanEdit() {
  //DOM
  let taiKhoan = dom("#TaiKhoan").value;
  let spanEl = dom("#spanTaiKhoan");
  spanEl.style.color = "red";
  //Xét trường hợp tài khoản có để trống hay ko
  if (!taiKhoan) {
    spanEl.innerHTML = "Tài khoản không được để trống";
    return false;
  }
  //
  for (let i = 0; i < validateTaiKhoanEdits.length; i++) {
    if (taiKhoan === validateTaiKhoanEdits[i]) {
      spanEl.innerHTML = "Tài khoản không được trùng nhau";
      return false;
    }
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Họ tên có hợp lệ hay ko
function validateHoTen() {
  //DOM
  let hoTen = dom("#HoTen").value;
  let spanEl = dom("#spanHoTen");
  spanEl.style.color = "red";
  //Kiểm tra xem Họ tên có để trống hay ko
  if (!hoTen) {
    spanEl.innerHTML = "Họ tên không được để trống";
    return false;
  }

  //Kiểm tra trường hợp Họ tên chỉ bao gồm chữ ko chứa số và ký tự đặc biệt
  let regex =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s|_]+$/;
  if (!regex.test(hoTen)) {
    spanEl.innerHTML = "Họ tên chỉ bao gồm chữ cái";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Mật khẩu có hợp lệ hay ko
function validateMatKhau() {
  //DOM
  let matKhau = dom("#MatKhau").value;
  let spanEl = dom("#spanMatKhau");
  spanEl.style.color = "red";

  //Kiểm tra xem Mật khẩu có để trống hay ko
  if (!matKhau) {
    spanEl.innerHTML = "Mật khẩu không được để trống";
    return false;
  }

  //Kiểm tra Mật khẩu phải có từ 6 đến 8 ký tự
  if (matKhau.length < 6 || matKhau.length > 8) {
    spanEl.innerHTML = "Mật khẩu phải có từ 6 đến 8 ký tự";
    return false;
  }

  //Kiểm tra Mật khẩu phải có ít nhất 1 kí tự in hoa, 1 kí tự đặc biệt, 1 kí số
  let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])/;
  if (!regex.test(matKhau)) {
    spanEl.innerHTML =
      "Mật khẩu phải có ít nhất 1 kí tự hoa, 1 kí tự đặc biệt và 1 kí số";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Email có hợp lệ hay ko
function validateEmail() {
  //DOM
  let email = dom("#Email").value;
  let spanEl = dom("#spanEmail");
  spanEl.style.color = "red";

  //Kiểm tra xem Email có bỏ trống hay ko
  if (!email) {
    spanEl.innerHTML = "Email không được để trống";
    return false;
  }

  //Kiểm tra xem email có đúng format hay ko
  let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!regex.test(email)) {
    spanEl.innerHTML = "Email không đúng định dạng";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra xem Hình ảnh có hợp lệ hay ko
function validateHinhAnh() {
  //DOM
  let hinhAnh = dom("#HinhAnh").value;
  let spanEl = dom("#spanHinhAnh");
  spanEl.style.color = "red";

  //Kiểm tra xem Hình ảnh có để trống hay ko
  if (!hinhAnh) {
    spanEl.innerHTML = "Hình ảnh không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra xem Loại người dùng đã chọn hay chưa
function validateLoaiND() {
  //DOM
  let loaiND = dom("#loaiNguoiDung").value;
  let spanEl = dom("#spanLoaiND");
  spanEl.style.color = "red";

  //Kiểm tra xem loại người dùng đã chọn chưa
  if (!loaiND) {
    spanEl.innerHTML = "Hãy chọn loại người dùng";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra xem Loại ngôn ngữ đã chọn hay chưa
function validateLoaiNN() {
  //DOM
  let loaiNN = dom("#loaiNgonNgu").value;
  let spanEl = dom("#spanLoaiNN");
  spanEl.style.color = "red";

  //Kiểm tra xem Loại ngôn ngữ đã chọn chưa
  if (!loaiNN) {
    spanEl.innerHTML = "Hãy chọn loại ngôn ngữ";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra xem Mô tả có hợp lệ hay ko
function validateMoTa() {
  //DOM
  let moTa = dom("#MoTa").value;
  let spanEl = dom("#spanMoTa");
  spanEl.style.color = "red";

  //Kiểm tra xem Mô tả có để trống hay ko
  if (!moTa) {
    spanEl.innerHTML = "Mô tả không được để trống";
    return false;
  }

  //Kiểm tra xem Mô tả có vượt quá 60 kí tự hay ko
  if (moTa.length > 60) {
    spanEl.innerHTML = "Mô tả không được quá 60 kí tự";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra form input có hợp lệ hay ko trước khi add user
function validateForm() {
  let form = true;
  form =
    validateTaiKhoan() &
    validateHoTen() &
    validateMatKhau() &
    validateEmail() &
    validateHinhAnh() &
    validateLoaiND() &
    validateLoaiNN() &
    validateMoTa();

  if (!form) {
    alert("Thông tin không hợp lệ");
    return false;
  }

  return true;
}

//Hàm kiểm tra form input có hợp lệ hay ko trước khi edit user
function validateFormEdit() {
  let form = true;
  form =
    validateTaiKhoanEdit() &
    validateHoTen() &
    validateMatKhau() &
    validateEmail() &
    validateHinhAnh() &
    validateLoaiND() &
    validateLoaiNN() &
    validateMoTa();

  if (!form) {
    alert("Thông tin không hợp lệ");
    return false;
  }

  return true;
}
