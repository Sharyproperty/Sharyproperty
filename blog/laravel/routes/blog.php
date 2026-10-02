<?php

/*
 | أضف السطور دي في routes/web.php
 */

use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
