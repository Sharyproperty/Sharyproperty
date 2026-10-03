<?php

/*
 | أضف السطور دي في routes/web.php
 | النسخة الإنجليزي بنفس الصفحة تحت /en (لو الموقع عنده طريقة جاهزة للغات، استخدموها بدل المجموعة دي).
 */

use App\Http\Controllers\AreaController;
use Illuminate\Support\Facades\Route;

Route::get('/areas/{slug}', [AreaController::class, 'show'])->name('areas.show');

Route::prefix('en')->group(function () {
    Route::get('/areas/{slug}', function (string $slug) {
        app()->setLocale('en');

        return app(AreaController::class)->show($slug);
    })->name('en.areas.show');
});
