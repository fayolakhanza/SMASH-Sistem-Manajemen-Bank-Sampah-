"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const maker_module_1 = require("./modules/maker/maker.module");
const auth_module_1 = require("./modules/auth/auth.module");
const nasabah_module_1 = require("./modules/nasabah/nasabah.module");
const kategori_module_1 = require("./modules/kategori-sampah/kategori.module");
const setor_module_1 = require("./modules/setor-sampah/setor.module");
const hadiah_module_1 = require("./modules/hadiah/hadiah.module");
const penukaran_module_1 = require("./modules/penukaran-poin/penukaran.module");
const rekapitulasi_module_1 = require("./modules/rekapitulasi/rekapitulasi.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const app_key_guard_1 = require("./common/guards/app-key.guard");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const transform_response_interceptor_1 = require("./common/interceptors/transform-response.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            maker_module_1.MakerModule,
            auth_module_1.AuthModule,
            nasabah_module_1.NasabahModule,
            kategori_module_1.KategoriSampahModule,
            setor_module_1.SetorSampahModule,
            hadiah_module_1.HadiahModule,
            penukaran_module_1.PenukaranPoinModule,
            rekapitulasi_module_1.RekapitulasiModule,
            dashboard_module_1.DashboardModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: app_key_guard_1.AppKeyGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_response_interceptor_1.TransformResponseInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map