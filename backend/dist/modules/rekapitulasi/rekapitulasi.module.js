"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RekapitulasiModule = void 0;
const common_1 = require("@nestjs/common");
const rekapitulasi_controller_1 = require("./rekapitulasi.controller");
const rekapitulasi_service_1 = require("./rekapitulasi.service");
let RekapitulasiModule = class RekapitulasiModule {
};
exports.RekapitulasiModule = RekapitulasiModule;
exports.RekapitulasiModule = RekapitulasiModule = __decorate([
    (0, common_1.Module)({
        controllers: [rekapitulasi_controller_1.RekapitulasiController],
        providers: [rekapitulasi_service_1.RekapitulasiService],
        exports: [rekapitulasi_service_1.RekapitulasiService],
    })
], RekapitulasiModule);
//# sourceMappingURL=rekapitulasi.module.js.map