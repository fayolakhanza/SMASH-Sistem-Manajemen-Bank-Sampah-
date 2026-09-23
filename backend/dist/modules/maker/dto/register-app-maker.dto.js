"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterAppMakerDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterAppMakerDto {
    email;
    password;
    namaSiswa;
    kelas;
    namaApp;
}
exports.RegisterAppMakerDto = RegisterAppMakerDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Format email tidak valid.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email wajib diisi.' }),
    __metadata("design:type", String)
], RegisterAppMakerDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password wajib diisi.' }),
    (0, class_validator_1.MinLength)(6, { message: 'Kata sandi minimal 6 karakter.' }),
    __metadata("design:type", String)
], RegisterAppMakerDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nama siswa harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama siswa wajib diisi.' }),
    __metadata("design:type", String)
], RegisterAppMakerDto.prototype, "namaSiswa", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Kelas harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Kelas wajib diisi.' }),
    __metadata("design:type", String)
], RegisterAppMakerDto.prototype, "kelas", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nama app harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama app wajib diisi.' }),
    __metadata("design:type", String)
], RegisterAppMakerDto.prototype, "namaApp", void 0);
//# sourceMappingURL=register-app-maker.dto.js.map