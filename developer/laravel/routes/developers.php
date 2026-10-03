<?php

/*
 | أضف السطور دي في routes/web.php
 | النسخة الإنجليزي بنفس الصفحة تحت /en (لو الموقع عنده طريقة جاهزة للغات، استخدموها بدل المجموعة دي).
 */

use App\Http\Controllers\DeveloperController;
use Illuminate\Support\Facades\Route;

Route::get('/developers/{slug}', [DeveloperController::class, 'show'])->name('developers.show');

Route::prefix('en')->group(function () {
    Route::get('/developers/{slug}', function (string $slug) {
        app()->setLocale('en');

        return app(DeveloperController::class)->show($slug);
    })->name('en.developers.show');
});
