<?php

/*
 | أضف السطور دي في routes/web.php
 | النسخة الإنجليزي بنفس الصفحات تحت /en (لو الموقع عنده طريقة جاهزة للغات، استخدموها بدل المجموعة دي).
 */

use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

Route::prefix('en')->group(function () {
    Route::get('/blog', function () {
        app()->setLocale('en');

        return app(BlogController::class)->index();
    })->name('en.blog.index');

    Route::get('/blog/{slug}', function (string $slug) {
        app()->setLocale('en');

        return app(BlogController::class)->show($slug);
    })->name('en.blog.show');
});
