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
exports.CreateKategoriSampahDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateKategoriSampahDto {
    namaKategori;
    hargaPerKg;
    poinPerKg;
    jenis;
    foto;
}
exports.CreateKategoriSampahDto = CreateKategoriSampahDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nama kategori harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama kategori wajib diisi.' }),
    __metadata("design:type", String)
], CreateKategoriSampahDto.prototype, "namaKategori", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Harga per kg harus berupa angka.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Harga per kg wajib diisi.' }),
    __metadata("design:type", Number)
], CreateKategoriSampahDto.prototype, "hargaPerKg", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Poin per kg harus berupa angka.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Poin per kg wajib diisi.' }),
    __metadata("design:type", Number)
], CreateKategoriSampahDto.prototype, "poinPerKg", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Jenis harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Jenis wajib diisi.' }),
    __metadata("design:type", String)
], CreateKategoriSampahDto.prototype, "jenis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKategoriSampahDto.prototype, "foto", void 0);
//# sourceMappingURL=create-kategori.dto.js.map