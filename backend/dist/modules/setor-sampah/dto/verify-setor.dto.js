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
exports.VerifySetorSampahDto = exports.VerifyItemSetorDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class VerifyItemSetorDto {
    kategoriSampahId;
    beratKgReal;
}
exports.VerifyItemSetorDto = VerifyItemSetorDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'kategoriSampahId harus berupa string UUID.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'kategoriSampahId wajib diisi.' }),
    __metadata("design:type", String)
], VerifyItemSetorDto.prototype, "kategoriSampahId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'beratKgReal harus berupa angka.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'beratKgReal wajib diisi.' }),
    __metadata("design:type", Number)
], VerifyItemSetorDto.prototype, "beratKgReal", void 0);
class VerifySetorSampahDto {
    status;
    catatanAdmin;
    itemsReal;
}
exports.VerifySetorSampahDto = VerifySetorSampahDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Status harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Status wajib diisi.' }),
    __metadata("design:type", String)
], VerifySetorSampahDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'catatanAdmin harus berupa string.' }),
    __metadata("design:type", String)
], VerifySetorSampahDto.prototype, "catatanAdmin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => VerifyItemSetorDto),
    __metadata("design:type", Array)
], VerifySetorSampahDto.prototype, "itemsReal", void 0);
//# sourceMappingURL=verify-setor.dto.js.map