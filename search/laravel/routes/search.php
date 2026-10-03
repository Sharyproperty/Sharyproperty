<?php

/*
 | أضف السطور دي في routes/web.php
 | النسخة الإنجليزي بنفس الصفحة تحت /en (لو الموقع عنده طريقة جاهزة للغات، استخدموها بدل المجموعة دي).
 | ?view=compounds بيعرض الكمبوندات بدل الوحدات ، ?page=2 الصفحة اللي بعدها (التحميل وأنت نازل).
 */

use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

Route::get('/search', [SearchController::class, 'index'])->name('search.index');   // البحث العام: عقارات مصر / كمبوندات مصر
Route::get('/search/{slug}', [SearchController::class, 'show'])->name('search.show');

Route::prefix('en')->group(function () {
    Route::get('/search', function () {
        app()->setLocale('en');

        return app(SearchController::class)->index();
    })->name('en.search.index');

    Route::get('/search/{slug}', function (string $slug) {
        app()->setLocale('en');

        return app(SearchController::class)->show($slug);
    })->name('en.search.show');
});
