
/*
 * أيقونات السوشيال والمتاجر (واتساب، فيسبوك، آبل ...) — بدل تحميل مكتبة Font Awesome كلها (حوالي 550 كيلو جافاسكربت) عشان الصفحة تفتح أسرع.
 * الاستخدام زي ما هو: <i class="fa-brands fa-whatsapp"></i> — السكربت بيبدّل العنصر بـ SVG جاهز (ولو اتضاف عنصر بعد التحميل، زي نافذة المشاركة، بيتبدّل برضه).
 * لو محتاج أيقونة مش موجودة هنا: زوّد سطر في ICONS (العرض، الارتفاع، مسار الـ SVG).
 * Icons: Font Awesome Free (fontawesome.com) — CC BY 4.0.
 */
(function () {
    'use strict';
    var ICONS = {"whatsapp":[448,512,"M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z"],"facebook-f":[320,512,"M80 299.3l0 212.7 116 0 0-212.7 86.5 0 18-97.8-104.5 0 0-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2l0-88.7C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4l0 42.1-66 0 0 97.8 66 0z"],"facebook":[512,512,"M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z"],"instagram":[448,512,"M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"],"x-twitter":[448,512,"M357.2 48L427.8 48 273.6 224.2 455 464 313 464 201.7 318.6 74.5 464 3.8 464 168.7 275.5-5.2 48 140.4 48 240.9 180.9 357.2 48zM332.4 421.8l39.1 0-252.4-333.8-42 0 255.3 333.8z"],"twitter":[512,512,"M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103l0-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"],"youtube":[576,512,"M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z"],"tiktok":[448,512,"M448.5 209.9c-44 .1-87-13.6-122.8-39.2l0 178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6-64.8 13.5-96.9 5.3-60.9-25.9-82.7-50.8-35.3-56-39-88.9 2.9-66.1 18.6-95.2 40-52.7 69.6-67.7 62.9-20.5 95.7-16l0 89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3-14 28.1-13.9 43.9 5.2 31 14.5 43.7 22.4 22.1 37.4 26.9 31.1 4.8 46-.1 28-14.4 37.2-27.1 14.2-28.1 14.2-43.8l0-349.4 88 0c-.1 7.4 .6 14.9 1.9 22.2 3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1l0 87.4z"],"snapchat":[512,512,"M497.1 366.6c-3.4-9.2-9.8-14.1-17.1-18.2-1.4-.8-2.6-1.5-3.7-1.9-2.2-1.1-4.4-2.2-6.6-3.4-22.8-12.1-40.6-27.3-53-45.4-3.5-5.1-6.6-10.5-9.1-16.1-1.1-3-1-4.7-.2-6.3 .8-1.2 1.7-2.2 2.9-3 3.9-2.6 8-5.2 10.7-7 4.9-3.2 8.8-5.7 11.2-7.4 9.4-6.5 15.9-13.5 20-21.3 2.9-5.4 4.5-11.3 4.9-17.4s-.6-12.2-2.8-17.8c-6.2-16.3-21.6-26.4-40.3-26.4-3.9 0-7.9 .4-11.7 1.2-1 .2-2.1 .5-3.1 .7 .2-11.2-.1-22.9-1.1-34.5-3.5-40.8-17.8-62.1-32.7-79.2-9.5-10.7-20.7-19.7-33.2-26.7-22.6-12.9-48.2-19.4-76.1-19.4s-53.4 6.5-76 19.4c-12.5 7-23.7 16.1-33.3 26.8-14.9 17-29.2 38.4-32.7 79.2-1 11.6-1.2 23.4-1.1 34.5-1-.3-2-.5-3.1-.7-3.9-.8-7.8-1.2-11.7-1.2-18.7 0-34.1 10.1-40.3 26.4-2.2 5.7-3.2 11.8-2.8 17.8s2 12 4.9 17.4c4.1 7.8 10.7 14.7 20 21.3 2.5 1.7 6.4 4.2 11.2 7.4 2.6 1.7 6.5 4.2 10.3 6.7 1.3 .9 2.4 2 3.3 3.3 .8 1.6 .8 3.4-.4 6.6-2.5 5.5-5.5 10.8-8.9 15.8-12.1 17.7-29.4 32.6-51.4 44.6-11.7 6.2-23.9 10.3-29 24.3-3.9 10.5-1.3 22.5 8.5 32.6 3.6 3.8 7.8 6.9 12.4 9.4 9.6 5.3 19.8 9.3 30.3 12.1 2.2 .6 4.3 1.5 6.1 2.7 3.6 3.1 3.1 7.9 7.8 14.8 2.4 3.6 5.4 6.7 9 9.1 10 6.9 21.3 7.4 33.2 7.8 10.8 .4 23 .9 36.9 5.5 5.8 1.9 11.8 5.6 18.7 9.9 16.7 10.3 39.6 24.3 77.8 24.3s61.3-14.1 78.1-24.4c6.9-4.2 12.9-7.9 18.5-9.8 13.9-4.6 26.2-5.1 36.9-5.5 11.9-.5 23.2-.9 33.2-7.8 4.2-2.9 7.7-6.7 10.2-11.2 3.4-5.8 3.4-9.9 6.6-12.8 1.8-1.2 3.7-2.1 5.8-2.6 10.7-2.8 21-6.9 30.8-12.2 4.9-2.6 9.3-6.1 13-10.2l.1-.2c9.2-9.9 11.5-21.5 7.8-31.8zm-34 18.3c-20.7 11.5-34.5 10.2-45.3 17.1-9.1 5.9-3.7 18.5-10.3 23.1-8.1 5.6-32.2-.4-63.2 9.9-25.6 8.5-42 32.8-88 32.8s-62-24.3-88.1-32.9c-31-10.3-55.1-4.2-63.2-9.9-6.6-4.6-1.2-17.2-10.3-23.1-10.7-6.9-24.5-5.7-45.3-17.1-13.2-7.3-5.7-11.8-1.3-13.9 75.1-36.4 87.1-92.6 87.7-96.7 .6-5 1.4-9-4.2-14.1-5.4-5-29.2-19.7-35.8-24.3-10.9-7.6-15.7-15.3-12.2-24.6 2.5-6.5 8.5-8.9 14.9-8.9 2 0 4 .2 6 .7 12 2.6 23.7 8.6 30.4 10.2 .8 .2 1.6 .3 2.5 .3 3.6 0 4.9-1.8 4.6-5.9-.8-13.1-2.6-38.7-.6-62.6 2.8-32.9 13.4-49.2 26-63.6 6.1-6.9 34.5-37 88.9-37S339 74.2 345 81.1c12.6 14.4 23.2 30.7 26 63.6 2.1 23.9 .3 49.5-.6 62.6-.3 4.3 1 5.9 4.6 5.9 .8 0 1.7-.1 2.5-.3 6.7-1.6 18.4-7.6 30.4-10.2 2-.4 4-.7 6-.7 6.4 0 12.4 2.5 14.9 8.9 3.5 9.4-1.2 17-12.2 24.6-6.6 4.6-30.4 19.3-35.8 24.3-5.6 5.1-4.8 9.1-4.2 14.2 .5 4.2 12.5 60.4 87.7 96.7 4.4 2.2 11.9 6.7-1.3 14.1z"],"linkedin-in":[448,512,"M100.3 448l-92.9 0 0-299.1 92.9 0 0 299.1zM53.8 108.1C24.1 108.1 0 83.5 0 53.8 0 39.5 5.7 25.9 15.8 15.8s23.8-15.8 38-15.8 27.9 5.7 38 15.8 15.8 23.8 15.8 38c0 29.7-24.1 54.3-53.8 54.3zM447.9 448l-92.7 0 0-145.6c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7l0 148.1-92.8 0 0-299.1 89.1 0 0 40.8 1.3 0c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3l0 164.3-.1 0z"],"linkedin":[448,512,"M416 32L31.9 32C14.3 32 0 46.5 0 64.3L0 447.7C0 465.5 14.3 480 31.9 480L416 480c17.6 0 32-14.5 32-32.3l0-383.4C448 46.5 433.6 32 416 32zM135.4 416l-66.4 0 0-213.8 66.5 0 0 213.8-.1 0zM102.2 96a38.5 38.5 0 1 1 0 77 38.5 38.5 0 1 1 0-77zM384.3 416l-66.4 0 0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2z"],"telegram":[512,512,"M256 8a248 248 0 1 0 0 496 248 248 0 1 0 0-496zM371 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5c-2.2 .5-37.1 23.5-104.6 69.1-9.9 6.8-18.9 10.1-26.9 9.9-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3 .6-4.5 6.7-9 18.4-13.7 72.3-31.5 120.5-52.3 144.6-62.3 68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9 2 1.7 3.2 4.1 3.5 6.7 .5 3.2 .6 6.5 .4 9.8z"],"apple":[384,512,"M319.1 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-55.8 .9-115.1 44.5-115.1 133.2 0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.5 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"],"google-play":[448,512,"M293.6 234.3L72.9 13 353.7 174.2 293.6 234.3zM15.3 0C2.3 6.8-6.4 19.2-6.4 35.3l0 441.3c0 16.1 8.7 28.5 21.7 35.3L271.9 255.9 15.3 0zM440.5 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM72.9 499L353.7 337.8 293.6 277.7 72.9 499z"],"facebook-messenger":[512,512,"M256.6 8c-140 0-248.6 102.3-248.6 240.6 0 72.3 29.7 134.8 78.1 177.9 8.3 7.5 6.6 11.9 8 58.2 .1 3.2 1 6.4 2.6 9.2s3.9 5.2 6.7 6.9 5.9 2.8 9.1 3 6.5-.3 9.5-1.6C174.9 479 175.6 477.2 184.6 479.6 337.8 521.8 504 423.7 504 248.6 504 110.3 396.6 8 256.6 8zM405.8 193.1l-73 115.6c-2.8 4.3-6.4 8.1-10.6 11s-9.1 4.8-14.1 5.8-10.3 .8-15.3-.4-9.7-3.4-13.8-6.4l-58.1-43.5c-2.6-1.9-5.8-3-9-3s-6.4 1.1-9 3l-78.4 59.4c-10.5 7.9-24.2-4.6-17.1-15.7l73-115.6c2.8-4.3 6.4-8.1 10.6-11s9.1-4.8 14.1-5.8 10.3-.8 15.3 .4 9.7 3.4 13.9 6.4l58.1 43.5c2.6 1.9 5.8 3 9 3s6.4-1.1 9-3l78.4-59.4c10.4-8 24.1 4.5 17.1 15.6z"],"threads":[448,512,"M340.8 238c-.6-69.6-38.3-111.5-102-111.5-42.5 0-78.3 19.2-97.1 49.9l41.2 28.7c10.7-16.8 25.4-30.8 52.4-30.8 30.5 0 46.3 17 50.8 48.5-14.7-2.3-29.5-3.5-44.6-3.5-82.4 0-121.1 37.3-121.1 86.6s38.8 79.7 95.9 79.7c62.7 0 100.1-42.2 115.4-94.5 15.9 7.2 26.9 24 26.9 49.3 0 67.6-78 104.5-144.1 104.5-97.5 0-161.3-64-161.3-168.2 0-127.6 84.3-209.4 197.6-209.4 76 0 113.6 33.4 139.2 78.1L432 115.9c-27.8-58-89.9-99.5-183.1-99.5-148.5 0-249.5 105.4-249.5 258.2 0 139.8 98.9 220.9 216.7 220.9 97.4 0 195.8-56.8 195.8-154 0-50.8-29.2-84.5-71.2-103.5zM214.4 334.9c-21.5 0-40.4-10.2-40.4-29 0-29.6 36.4-38.6 72-38.6 13.5 0 26.8 .9 38.5 3.5-8.4 38.5-33.4 64.2-70 64.2l0 0z"],"pinterest":[512,512,"M504 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3 .8-3.4 5-20.3 6.9-28.1 .6-2.5 .3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2C161.5 437.2 163.5 467.4 165.6 487 73.4 450.9 8 361.1 8 256 8 119 119 8 256 8S504 119 504 256z"]};
    var NS = 'http://www.w3.org/2000/svg';
    function swap(el) {
        var name = null;
        for (var i = 0; i < el.classList.length; i++) {
            var cls = el.classList[i];
            if (cls !== 'fa-brands' && cls.indexOf('fa-') === 0 && ICONS[cls.slice(3)]) { name = cls.slice(3); break; }
        }
        if (!name || !el.parentNode) return;
        var icon = ICONS[name];
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'svg-inline--fa ' + el.className);
        svg.setAttribute('viewBox', '0 0 ' + icon[0] + ' ' + icon[1]);
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('fill', 'currentColor');
        path.setAttribute('d', icon[2]);
        svg.appendChild(path);
        el.parentNode.replaceChild(svg, el);
    }
    function scan(root) {
        if (root.nodeType !== 1) return;
        if (root.matches && root.matches('i.fa-brands')) swap(root);
        else if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('i.fa-brands'), swap);
    }
    function start() {
        scan(document.documentElement);
        if (!('MutationObserver' in window)) return;
        new MutationObserver(function (changes) {
            changes.forEach(function (change) { Array.prototype.forEach.call(change.addedNodes, scan); });
        }).observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/**
 * الهيدر والفوتر:
 * - زرار القائمة في الموبايل بيفتح ويقفل روابط الهيدر.
 * - مجموعات الفوتر في الموبايل بتفتح وتقفل (في الديسك توب مفتوحة دايمًا من الـ CSS).
 * - رابط له قايمة فرعية في الهيدر (زي "الوكلاء" ← "الوكلاء المعتمدون"): الضغط بيفتح القايمة ويقفلها،
 *   وبتتقفل لما تضغط براها أو تدوس Esc.
 * - المفضلة (القلب على أي كارت): الضغط بيخليها حمراء (aria-pressed) وضغطة تانية بترجّعها. الحالة بتتحفظ على المتصفح
 *   بالـ data-favorite-id، وبيتبعت حدث shary:favorite ({ id, active }) عشان الباك إند يحفظها في حساب العميل.
 *   قلب الهيدر (data-favorites-indicator) بيبقى أحمر وعليه العدد طول ما فيه حاجة في المفضلة، وبيفتح صفحة المفضلة.
 * - المشاركة (data-share-url): موبايل = قايمة المشاركة بتاعة الموبايل، ولو مش متاحة بتطلع قايمة شاري من تحت (واتساب/تيليجرام/فيسبوك/X/البريد/نسخ).
 *   ديسك توب = نسخ اللينك + "تم نسخ الرابط". حدث shary:share ({ url, title }) — ممكن تغيّر detail.url أو تمنعه.
 * - زرار الرجوع (window.SharyBack): أي حاجة بتتفتح فوق الصفحة (تصفية، لوحات الفلاتر، طلب الاجتماع، Shary AI، قايمة المشاركة)
 *   بتتسجل في تاريخ المتصفح، فزرار الرجوع (أو سحبة الرجوع في الموبايل) بيقفلها والعميل بيفضل في نفس الصفحة ونفس المكان بدل ما يخرج منها.
 * - المقارنة (data-compare-toggle + data-compare-id): بتظهر زرار المقارنة تحت (data-compare-bar) بعدد المختار، وبيفتح صفحة المقارنة. حدث shary:compare.
 */
(function () {
    // ---- زرار الرجوع بيقفل اللي مفتوح بدل ما يخرج من الصفحة
    // opened(close): بتتنادى لما لوحة تتفتح. closed(after): لما تتقفل من X / Esc / الضغط براها (after بتتنفذ بعد ما التاريخ يرجع خطوة).
    window.SharyBack = (function () {
        var open = [];        // دوال القفل للّوحات المفتوحة (الأحدث في الآخر)
        var skip = 0;         // رجوع إحنا اللي طلبناه (مش العميل)
        var busy = false;     // القفل جاي من زرار الرجوع
        var waiting = null;
        var timer = null;

        function done() {
            clearTimeout(timer);
            var after = waiting;
            waiting = null;
            if (after) after();
        }

        window.addEventListener('popstate', function () {
            if (skip) { skip--; done(); return; }
            var close = open.pop();
            if (!close) return;
            busy = true;
            try { close(); } finally { busy = false; }
        });

        return {
            opened: function (close) {
                open.push(close);
                try { history.pushState({ sharyOverlay: open.length }, ''); } catch (error) { /* التاريخ مش متاح: اللوحة بتشتغل عادي من غيره */ }
            },
            closed: function (after) {
                if (busy || !open.length) { if (after) after(); return; }
                open.pop();
                var state = null;
                try { state = history.state; } catch (error) { /* مش متاح */ }
                if (!state || !state.sharyOverlay) { if (after) after(); return; }
                skip++;
                waiting = after || null;
                timer = setTimeout(function () { skip = 0; done(); }, 500);
                history.back();
            }
        };
    })();

    document.querySelectorAll('[data-nav-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var nav = document.getElementById(button.getAttribute('aria-controls'));
            if (!nav) return;
            var isOpen = !nav.classList.toggle('hidden');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });

    document.querySelectorAll('[data-footer-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var list = button.nextElementSibling;
            if (!list) return;
            var isOpen = !list.classList.toggle('hidden');
            list.classList.toggle('flex', isOpen);
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });
    var dropdowns = Array.prototype.slice.call(document.querySelectorAll('[data-nav-dropdown]'));

    function setDropdown(dropdown, open) {
        var toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
        var menu = dropdown.querySelector('[data-nav-dropdown-menu]');
        if (!toggle || !menu) return;
        menu.classList.toggle('hidden', !open);
        menu.classList.toggle('flex', open && menu.classList.contains('flex-col'));
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        var arrow = toggle.querySelector('[data-nav-dropdown-arrow]');
        if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
    }

    dropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var open = toggle.getAttribute('aria-expanded') !== 'true';
            dropdowns.forEach(function (other) { setDropdown(other, other === dropdown && open); });
        });
        dropdown.querySelectorAll('[data-nav-dropdown-menu] a').forEach(function (link) {
            link.addEventListener('click', function () { setDropdown(dropdown, false); });
        });
    });

    document.addEventListener('click', function (event) {
        dropdowns.forEach(function (dropdown) {
            if (!dropdown.contains(event.target)) setDropdown(dropdown, false);
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') dropdowns.forEach(function (dropdown) { setDropdown(dropdown, false); });
    });
    // ---- رسالة صغيرة تحت الشاشة (مثلاً: "تم نسخ الرابط")
    var toastNode = null;
    var toastTimer = null;
    function toast(text) {
        if (!toastNode) {
            toastNode = document.createElement('div');
            toastNode.setAttribute('role', 'status');
            toastNode.className = 'shary-toast';
            document.body.appendChild(toastNode);
        }
        toastNode.textContent = text;
        toastNode.classList.add('is-shown');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastNode.classList.remove('is-shown'); }, 2600);
    }
    function english(node) {
        var holder = node.closest('[lang]');
        return ((holder && holder.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
    }

    // ---- المفضلة: القلب على الكارت بيبقى أحمر، وقلب الهيدر بيبقى أحمر وعليه العدد طول ما فيه حاجة في المفضلة
    var favoriteKey = 'shary-favorites';
    var memory = [];

    function readFavorites() {
        try { return JSON.parse(window.localStorage.getItem(favoriteKey)) || []; } catch (error) { return memory; }
    }

    function writeFavorites(list) {
        memory = list;
        try { window.localStorage.setItem(favoriteKey, JSON.stringify(list)); } catch (error) { /* التخزين مش متاح: الحالة بتفضل على الصفحة بس */ }
    }

    function showFavorites() {
        var pressed = document.querySelectorAll('[data-favorite-toggle][aria-pressed="true"]').length;
        var total = Math.max(readFavorites().length, pressed);
        document.querySelectorAll('[data-favorites-indicator]').forEach(function (indicator) {
            indicator.setAttribute('data-active', total > 0 ? 'true' : 'false');
            var badge = indicator.querySelector('[data-favorites-count]');
            if (badge) { badge.textContent = total; badge.classList.toggle('hidden', total === 0); }
        });
    }

    // الضغطات كلها بتتسمع من الصفحة نفسها، فالكروت اللي بتتضاف بعدين (التحميل وأنت نازل) زرايرها بتشتغل زي الباقي
    function closest(event, selector) { return event.target.closest ? event.target.closest(selector) : null; }

    // بتعلّم القلوب المحفوظة جوه جزء من الصفحة (بتتنادى للكروت الجديدة: window.SharyCards.refresh(root))
    function markFavorites(root) {
        var saved = readFavorites();
        (root || document).querySelectorAll('[data-favorite-toggle]').forEach(function (button) {
            var id = button.getAttribute('data-favorite-id');
            if (id && saved.indexOf(id) !== -1) button.setAttribute('aria-pressed', 'true');
        });
        showFavorites();
    }
    window.SharyCards = { refresh: markFavorites };

    document.addEventListener('click', function (event) {
        var button = closest(event, '[data-favorite-toggle]');
        if (!button) return;
        var id = button.getAttribute('data-favorite-id');
        var active = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        if (id) {
            var list = readFavorites().filter(function (item) { return item !== id; });
            if (active) list.push(id);
            writeFavorites(list);
        }
        showFavorites();
        button.dispatchEvent(new CustomEvent('shary:favorite', { bubbles: true, detail: { id: id, active: active } }));
    });
    markFavorites(document);

    // ---- المشاركة
    // موبايل: قايمة المشاركة بتاعة الموبايل نفسه (واتساب، ماسنجر، ...). لو المتصفح مش بيدعمها أو منعها، بتطلع قايمة شاري من تحت
    //         (واتساب / تيليجرام / فيسبوك / X / البريد / نسخ الرابط) — يعني زرار المشاركة عمره ما بيبقى "نسخ بس" على الموبايل.
    // ديسك توب: نسخ اللينك + "تم نسخ الرابط".
    // حدث shary:share ({ url, title }): أي كود ممكن يغيّر detail.url / detail.title، أو يستلم المشاركة مكاننا بـ preventDefault().
    var nativeShareBlocked = false;
    var shareSheet = null;

    function copyText(text, done, failed) {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, failed);
        else failed();
    }

    function closeShareSheet() {
        if (!shareSheet || !shareSheet.classList.contains('is-open')) return;
        shareSheet.classList.remove('is-open');
        window.SharyBack.closed();
    }

    function openShareSheet(url, title, en) {
        if (!shareSheet) {
            shareSheet = document.createElement('div');
            shareSheet.className = 'shary-share';
            shareSheet.setAttribute('role', 'dialog');
            shareSheet.setAttribute('aria-modal', 'true');
            shareSheet.innerHTML =
                '<div class="shary-share__dim" data-share-close></div>' +
                '<div class="shary-share__panel">' +
                    '<span class="shary-share__grip" aria-hidden="true"></span>' +
                    '<div class="shary-share__head"><h3 data-share-heading></h3>' +
                        '<button type="button" class="shary-share__close" data-share-close><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
                    '<div class="shary-share__link"><div><strong data-share-name></strong><span dir="ltr" data-share-link></span></div>' +
                        '<button type="button" data-share-copy></button></div>' +
                    '<div class="shary-share__grid" data-share-targets></div>' +
                '</div>';
            document.body.appendChild(shareSheet);
            shareSheet.addEventListener('click', function (event) {
                if (event.target.closest('[data-share-close]') || event.target.closest('a[data-share-target]')) closeShareSheet();
            });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeShareSheet(); });
        }

        var u = encodeURIComponent(url);
        var t = encodeURIComponent(title);
        var targets = [
            ['shary-share__icon--whatsapp', 'fa-brands fa-whatsapp', en ? 'WhatsApp' : 'واتساب', 'https://wa.me/?text=' + encodeURIComponent(title + '\n' + url)],
            ['shary-share__icon--telegram', 'fa-brands fa-telegram', en ? 'Telegram' : 'تيليجرام', 'https://t.me/share/url?url=' + u + '&text=' + t],
            ['shary-share__icon--facebook', 'fa-brands fa-facebook-f', en ? 'Facebook' : 'فيسبوك', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
            ['shary-share__icon--x', 'fa-brands fa-x-twitter', 'X', 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t],
            ['shary-share__icon--mail', '', en ? 'Email' : 'البريد', 'mailto:?subject=' + t + '&body=' + u]
        ];

        shareSheet.dir = en ? 'ltr' : 'rtl';
        shareSheet.lang = en ? 'en' : 'ar';
        shareSheet.setAttribute('aria-label', en ? 'Share' : 'مشاركة');
        shareSheet.querySelector('[data-share-heading]').textContent = en ? 'Share' : 'مشاركة';
        shareSheet.querySelectorAll('[data-share-close]')[1].setAttribute('aria-label', en ? 'Close' : 'إغلاق');
        shareSheet.querySelector('[data-share-name]').textContent = title;
        var shown = url;
        try { shown = decodeURI(url); } catch (error) { /* لينك فيه ترميز غير سليم: بيتعرض زي ما هو */ }
        shareSheet.querySelector('[data-share-link]').textContent = shown.replace(/^https?:\/\//, '');

        var copyButton = shareSheet.querySelector('[data-share-copy]');
        copyButton.textContent = en ? 'Copy' : 'نسخ';
        copyButton.classList.remove('is-done');
        copyButton.onclick = function () {
            copyText(url, function () {
                copyButton.textContent = en ? 'Copied' : 'تم النسخ';
                copyButton.classList.add('is-done');
            }, function () { toast(url); });
        };

        var grid = shareSheet.querySelector('[data-share-targets]');
        grid.innerHTML = '';
        targets.forEach(function (target) {
            var link = document.createElement('a');
            link.href = target[3];
            link.target = '_blank';
            link.rel = 'noopener';
            link.setAttribute('data-share-target', target[2]);
            var icon = target[1] ? '<i class="' + target[1] + '" aria-hidden="true"></i>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg>';
            link.innerHTML = '<span class="shary-share__icon ' + target[0] + '">' + icon + '</span><span></span>';
            link.lastChild.textContent = target[2];
            grid.appendChild(link);
        });
        // "المزيد": قايمة الموبايل نفسه، لو متاحة
        if (navigator.share && !nativeShareBlocked) {
            var more = document.createElement('button');
            more.type = 'button';
            more.innerHTML = '<span class="shary-share__icon shary-share__icon--more"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg></span><span></span>';
            more.lastChild.textContent = en ? 'More' : 'المزيد';
            more.addEventListener('click', function () {
                navigator.share({ title: title, text: title, url: url }).then(closeShareSheet, function (error) {
                    if (!error || error.name !== 'AbortError') { nativeShareBlocked = true; more.remove(); }
                });
            });
            grid.appendChild(more);
        }

        if (!shareSheet.classList.contains('is-open')) {
            shareSheet.classList.add('is-open');
            window.SharyBack.opened(function () { shareSheet.classList.remove('is-open'); });
        }
    }

    document.addEventListener('click', function (event) {
        var button = closest(event, '[data-share-url]');
        if (!button) return;
        (function () {
            var detail = {
                url: new URL(button.getAttribute('data-share-url'), location.href).href,
                title: button.getAttribute('data-share-title') || document.title
            };
            if (!button.dispatchEvent(new CustomEvent('shary:share', { bubbles: true, cancelable: true, detail: detail }))) return;
            var url = detail.url;
            var title = detail.title;
            var en = english(button);
            var phone = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

            if (!phone) {
                copyText(url, function () { toast(en ? 'Link copied' : 'تم نسخ الرابط'); }, function () { toast(url); });
                return;
            }
            if (!navigator.share || nativeShareBlocked) { openShareSheet(url, title, en); return; }
            try {
                navigator.share({ title: title, text: title, url: url }).catch(function (error) {
                    if (error && error.name === 'AbortError') return;   // العميل قفل القايمة
                    nativeShareBlocked = true;
                    openShareSheet(url, title, en);
                });
            } catch (error) {
                nativeShareBlocked = true;
                openShareSheet(url, title, en);
            }
        })();
    });

    // ---- المقارنة: الضغط على "قارن" بيعلّم المشروع، وبيظهر زرار المقارنة تحت بعدد المشاريع المختارة — الضغط عليه بيفتح صفحة المقارنة
    function showCompare(scope) {
        var bar = scope.querySelector('[data-compare-bar]') || document.querySelector('[data-compare-bar]');
        if (!bar) return [];
        var ids = Array.prototype.map.call(scope.querySelectorAll('[data-compare-toggle][aria-pressed="true"]'), function (item) { return item.getAttribute('data-compare-id') || ''; });
        bar.classList.toggle('hidden', ids.length === 0);
        bar.classList.toggle('flex', ids.length > 0);
        var count = bar.querySelector('[data-compare-count]');
        if (count) count.textContent = ids.length;
        var base = bar.getAttribute('data-base') || '';
        if (base && base !== '#') bar.setAttribute('href', base + (base.indexOf('?') === -1 ? '?' : '&') + 'projects=' + ids.filter(Boolean).join(','));
        return ids;
    }
    document.addEventListener('click', function (event) {
        var button = closest(event, '[data-compare-toggle]');
        if (!button) return;
        var active = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        var ids = showCompare(button.closest('main') || document);
        button.dispatchEvent(new CustomEvent('shary:compare', { bubbles: true, detail: { id: button.getAttribute('data-compare-id'), active: active, ids: ids } }));
    });
    // ---------- نص بيتقصّر ويتفرد [data-collapsible] ("عن المطور" ، "عن الإيجار" ، "عن الوحدة") ----------
    // النص مفتوح في الأول. الزرار [data-collapsible-toggle] اللي جنبه بيقصّره (is-collapsed) ويفرده، ونصه بيتبدّل بين data-less و data-more.
    document.querySelectorAll('[data-collapsible]').forEach(function (box) {
        var toggle = box.parentNode.querySelector('[data-collapsible-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var collapse = !box.classList.contains('is-collapsed');
            box.classList.toggle('is-collapsed', collapse);
            toggle.setAttribute('aria-expanded', collapse ? 'false' : 'true');
            var label = toggle.querySelector('[data-label]');
            (label || toggle).textContent = toggle.getAttribute(collapse ? 'data-more' : 'data-less');
            if (collapse) box.scrollIntoView({ block: 'nearest' });
        });
    });

    // ---- عنصر ثابت تحت الهيدر [data-stick-under-header] (فورم الاستشارة في صفحة المقال على الديسك توب):
    // الـ CSS بيثبته (lg:sticky) والسكربت بيظبط المسافة من فوق على ارتفاع الهيدر الفعلي + 16px.
    document.querySelectorAll('[data-stick-under-header]').forEach(function (box) {
        var scope = box.closest('[lang]') || document;
        var waiting = false;
        function place() {
            waiting = false;
            if (!box.offsetHeight) return;   // الصفحة مخفية دلوقتي
            var header = scope.querySelector('header');
            var base = header ? (parseFloat(window.getComputedStyle(header).top) || 0) + header.offsetHeight : 0;
            box.style.top = (base + 16) + 'px';
        }
        window.addEventListener('resize', place);
        window.addEventListener('scroll', function () { if (!waiting) { waiting = true; window.requestAnimationFrame(place); } }, { passive: true });
        place();
    });

    // ---- صف كروت بيتحرك لوحده [data-auto-rail] (المشروعات الجديدة في صفحة المنطقة وصفحة المشروع):
    // موبايل وتابلت بس: الصف بيتحرك بالراحة كارت كارت (كل 3.5 ثانية) ولما يوصل للآخر بيرجع للأول. ديسك توب: مش بيتحرك لوحده.
    // بيقف طول ما العميل ماسكه، ولو مش ظاهر على الشاشة، ولو الجهاز مطفّي الحركة.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var railNarrow = window.matchMedia('(max-width: 1023px)');
        document.querySelectorAll('[data-auto-rail]').forEach(function (rail) {
            var cards = Array.prototype.slice.call(rail.children);
            if (cards.length < 2) return;
            var at = 0, held = false, seen = false, resume = null;
            function hold() { held = true; if (resume) { clearTimeout(resume); resume = null; } }
            function release(wait) { if (resume) clearTimeout(resume); resume = setTimeout(function () { held = false; resume = null; }, wait); }
            rail.addEventListener('touchstart', hold, { passive: true });
            rail.addEventListener('touchend', function () { release(5000); }, { passive: true });
            rail.addEventListener('focusin', hold);
            rail.addEventListener('focusout', function () { release(0); });
            if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) { seen = entries[0].isIntersecting; }, { threshold: 0.6 }).observe(rail);
            else seen = true;
            function offset(card) {   // المسافة بين أول الكارت وأول الصف (حسب اتجاه الصفحة)
                var box = rail.getBoundingClientRect(), r = card.getBoundingClientRect();
                var style = window.getComputedStyle(rail);
                var rtl = style.direction === 'rtl';
                var pad = parseFloat(rtl ? style.paddingRight : style.paddingLeft) || 0;
                return rtl ? r.right - (box.right - pad) : r.left - (box.left + pad);
            }
            window.setInterval(function () {
                if (!railNarrow.matches || held || !seen || document.hidden || !rail.offsetWidth) return;
                at = (at + 1) % cards.length;
                var room = rail.scrollWidth - rail.clientWidth - Math.abs(rail.scrollLeft);
                if (at === 0 || room < 2) { at = 0; rail.scrollTo({ left: 0, behavior: 'smooth' }); return; }
                rail.scrollTo({ left: rail.scrollLeft + offset(cards[at]), behavior: 'smooth' });
            }, 3500);
        });
    }

    // ---- شريط الإعلانات [data-ad-strip] (partials/ad-strip.blade.php): إعلان واحد ظاهر في البوكس، بيتسحب بالجنب وبيتبدّل لوحده كل 5 ثواني ----------
    document.querySelectorAll('[data-ad-strip]').forEach(function (strip) {
        var track = strip.querySelector('[data-ad-track]');
        var slides = track ? Array.prototype.slice.call(track.children) : [];
        var dots = Array.prototype.slice.call(strip.querySelectorAll('[data-ad-dots] button'));
        if (slides.length < 2) return;
        var at = 0;
        var seen = false;
        var held = false;

        function go(index, smooth) {
            at = (index + slides.length) % slides.length;
            var left = track.scrollLeft + slides[at].getBoundingClientRect().left - track.getBoundingClientRect().left;
            track.scrollTo({ left: left, behavior: smooth === false ? 'auto' : 'smooth' });
        }
        function mark() {
            var box = track.getBoundingClientRect();
            var best = 0, gap = Infinity;
            slides.forEach(function (slide, i) {
                var d = Math.abs(slide.getBoundingClientRect().left - box.left);
                if (d < gap) { gap = d; best = i; }
            });
            at = best;
            dots.forEach(function (dot, i) { dot.setAttribute('aria-current', i === at ? 'true' : 'false'); });
        }

        track.addEventListener('scroll', function () { window.requestAnimationFrame(mark); }, { passive: true });
        dots.forEach(function (dot, i) { dot.addEventListener('click', function () { go(i); }); });
        ['mouseenter', 'touchstart', 'focusin'].forEach(function (name) { strip.addEventListener(name, function () { held = true; }, { passive: true }); });
        ['mouseleave', 'touchend', 'focusout'].forEach(function (name) { strip.addEventListener(name, function () { held = false; }, { passive: true }); });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { seen = entries[0].isIntersecting; }, { threshold: 0.6 }).observe(strip);
        } else {
            seen = true;
        }
        // بيتبدّل لوحده بس والشريط ظاهر على الشاشة والعميل مش واقف عليه
        window.setInterval(function () { if (seen && !held && !document.hidden) go(at + 1); }, 5000);
    });
})();

/**
 * اختيار كود الدولة جنب رقم الهاتف (فورم الاستشارة).
 * بيشتغل على أي عنصر عليه data-phone-field: الزرار بيفتح القايمة، والاختيار بيغيّر العلم والكود
 * وقيمة الحقل المخفي country_code اللي بتتبعت مع الفورم.
 */
(function () {
    document.querySelectorAll('[data-phone-field]').forEach(function (field) {
        var toggle = field.querySelector('[data-phone-toggle]');
        var list = field.querySelector('[data-phone-list]');
        var flag = field.querySelector('[data-phone-flag]');
        var code = field.querySelector('[data-phone-code]');
        var value = field.querySelector('[data-phone-value]');
        var input = field.querySelector('input[type="tel"]');
        var options = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));

        function isOpen() {
            return !list.classList.contains('hidden');
        }

        function open(state) {
            list.classList.toggle('hidden', !state);
            toggle.setAttribute('aria-expanded', state ? 'true' : 'false');
            if (state) {
                var current = list.querySelector('[aria-selected="true"]') || options[0];
                current.focus();
            }
        }

        function select(option) {
            options.forEach(function (o) { o.setAttribute('aria-selected', o === option ? 'true' : 'false'); });
            flag.src = option.querySelector('img').src;
            code.textContent = option.getAttribute('data-code');
            value.value = option.getAttribute('data-code');
            open(false);
            input.focus();
        }

        toggle.addEventListener('click', function () { open(!isOpen()); });

        options.forEach(function (option, index) {
            option.addEventListener('click', function () { select(option); });
            option.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    select(option);
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    var next = options[index + (e.key === 'ArrowDown' ? 1 : -1)];
                    if (next) next.focus();
                } else if (e.key === 'Escape') {
                    open(false);
                    toggle.focus();
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (isOpen() && !field.contains(e.target)) open(false);
        });
    });
})();

/**
 * فورم "طلب اجتماع":
 * - أي عنصر عليه data-meeting-open (زرار "طلب مقابلة") بيفتح الفورم، وبتتقفل من علامة X أو الضغط براها أو Esc.
 * - زووم / اجتماع حضوري، واختيار اليوم والوقت: الاختيار بيتسجل في الحقول المخفية meeting_type و meeting_date و meeting_time.
 * - الأيام: السبع أيام الجاية (من بكرة) بتترسم من القالب <template data-meeting-day-template>، بلغة الصفحة.
 *   لو زراير الأيام مرسومة من الباك إند (عليها data-meeting-day) السكربت بيستخدمها زي ما هي.
 */
(function () {
    var modals = Array.prototype.slice.call(document.querySelectorAll('[data-meeting-modal]'));
    if (!modals.length) return;

    var lastOpener = null;

    function pad(number) {
        return (number < 10 ? '0' : '') + number;
    }

    function press(buttons, chosen) {
        buttons.forEach(function (button) { button.setAttribute('aria-pressed', button === chosen ? 'true' : 'false'); });
    }

    function fillDays(modal, dateField) {
        var holder = modal.querySelector('[data-meeting-days]');
        var template = modal.querySelector('[data-meeting-day-template]');
        if (!holder) return [];

        if (!holder.children.length && template) {
            var langNode = modal.closest('[lang]');
            var english = ((langNode && langNode.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
            var locale = english ? 'en-GB' : 'ar-EG-u-nu-latn';
            var count = parseInt(holder.getAttribute('data-count'), 10) || 7;

            for (var i = 1; i <= count; i++) {
                var day = new Date();
                day.setDate(day.getDate() + i);
                var button = template.content.firstElementChild.cloneNode(true);
                button.setAttribute('data-meeting-day', day.getFullYear() + '-' + pad(day.getMonth() + 1) + '-' + pad(day.getDate()));
                button.querySelector('[data-meeting-day-name]').textContent = day.toLocaleDateString(locale, { weekday: english ? 'short' : 'long' });
                button.querySelector('[data-meeting-day-date]').textContent = day.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
                holder.appendChild(button);
            }
        }

        var days = Array.prototype.slice.call(holder.querySelectorAll('[data-meeting-day]'));
        days.forEach(function (button) {
            button.addEventListener('click', function () {
                press(days, button);
                dateField.value = button.getAttribute('data-meeting-day');
            });
        });
        if (days.length) {
            var chosen = holder.querySelector('[aria-pressed="true"]') || days[0];
            press(days, chosen);
            dateField.value = chosen.getAttribute('data-meeting-day');
        }
        return days;
    }

    function close(modal) {
        if (modal.classList.contains('hidden')) return;
        modal.classList.add('hidden');
        document.documentElement.style.overflow = '';
        if (lastOpener) lastOpener.focus({ preventScroll: true });
        if (window.SharyBack) window.SharyBack.closed();
    }

    function open(modal, opener) {
        lastOpener = opener;
        modal.classList.remove('hidden');
        document.documentElement.style.overflow = 'hidden';
        // زرار الرجوع بيقفل الفورم والعميل بيفضل في الصفحة
        if (window.SharyBack) window.SharyBack.opened(function () { close(modal); });
        var first = modal.querySelector('input[name="name"]');
        if (first) first.focus({ preventScroll: true });
    }

    modals.forEach(function (modal) {
        var typeField = modal.querySelector('[data-meeting-type]');
        var timeField = modal.querySelector('[data-meeting-time]');
        var types = Array.prototype.slice.call(modal.querySelectorAll('[data-meeting-type-option]'));
        var times = Array.prototype.slice.call(modal.querySelectorAll('[data-meeting-time-option]'));

        fillDays(modal, modal.querySelector('[data-meeting-date]'));

        types.forEach(function (button) {
            button.addEventListener('click', function () {
                press(types, button);
                typeField.value = button.getAttribute('data-meeting-type-option');
            });
        });

        times.forEach(function (button) {
            button.addEventListener('click', function () {
                press(times, button);
                timeField.value = button.getAttribute('data-meeting-time-option');
            });
        });

        modal.querySelectorAll('[data-meeting-close]').forEach(function (element) {
            element.addEventListener('click', function () { close(modal); });
        });
    });

    // الزرار بيفتح أقرب فورم ليه في الصفحة
    document.addEventListener('click', function (event) {
        var opener = event.target.closest ? event.target.closest('[data-meeting-open]') : null;
        if (!opener) return;
        var node = opener.parentElement;
        var modal = null;
        while (node && !modal) {
            modal = node.querySelector('[data-meeting-modal]');
            node = node.parentElement;
        }
        if (!modal) return;
        event.preventDefault();
        open(modal, opener);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        modals.forEach(function (modal) {
            if (!modal.classList.contains('hidden')) close(modal);
        });
    });
})();

/**
 * صفحة المنطقة:
 * - نوع الوحدة (سكني / تجاري / ...): بيغيّر أرقام المؤشر والمقارنة ونطاق السعر ورسم سعر المتر من غير تحميل الصفحة.
 *   الأرقام جاية من الـ JSON اللي في [data-area-index-data] (بيتكتب من الداتا في الـ Blade).
 * - رسم سعر المتر لآخر 12 شهر: بيترسم من series، وتحريك الماوس أو الإصبع عليه بيعرض سعر كل شهر.
 * - "إزاي اتحسب؟" بيفتح ويقفل تفاصيل المؤشر، وزراير + و − بتكبّر وتصغّر الخريطة.
 * - زرار "قارن" في كارت المشروع: بيتعلّم (aria-pressed) وبيبعت حدث shary:compare ({ active }).
 * - الفلاتر: أي اختيار بيبعت الفورم (GET) عشان الباك إند يرجّع النتايج.
 */
(function () {
    function format(number) {
        return Number(number).toLocaleString('en-US');
    }

    document.querySelectorAll('[data-area-index]').forEach(function (card) {
        var source = card.querySelector('[data-area-index-data]');
        if (!source) return;
        var data;
        try { data = JSON.parse(source.textContent); } catch (error) { return; }

        var plot = card.querySelector('[data-plot]');
        var line = card.querySelector('[data-plot-line]');
        var fill = card.querySelector('[data-plot-area]');
        var cursor = card.querySelector('[data-plot-cursor]');
        var endDot = card.querySelector('[data-plot-end]');
        var endTip = card.querySelector('[data-plot-end-tip]');
        var hoverDot = card.querySelector('[data-plot-dot]');
        var hoverTip = card.querySelector('[data-plot-tip]');
        var table = card.querySelector('[data-plot-table]');
        var values = [];
        var toY = function () { return 0; };

        function draw(series) {
            values = series;
            var min = Math.min.apply(null, series);
            var max = Math.max.apply(null, series);
            var pad = (max - min) * 0.25 || 1;
            var low = min - pad * 0.2;
            toY = function (value) { return 90 - ((value - low) / (max + pad - low)) * 80; };
            var points = series.map(function (value, i) { return (i / (series.length - 1) * 100).toFixed(2) + ',' + toY(value).toFixed(2); });

            line.setAttribute('d', 'M' + points.join('L'));
            fill.setAttribute('d', 'M' + points.join('L') + 'L100,100L0,100Z');
            var last = series[series.length - 1];
            endDot.style.left = '100%';
            endDot.style.top = toY(last) + '%';
            endTip.style.top = toY(last) + '%';
            endTip.textContent = format(last);
            table.innerHTML = '<caption>' + data.caption + '</caption>' + series.map(function (value, i) {
                return '<tr><th>' + data.months[i] + '</th><td>' + format(value) + '</td></tr>';
            }).join('');
        }

        function set(key, value) {
            card.querySelectorAll('[data-k="' + key + '"]').forEach(function (el) { el.textContent = value; });
        }

        function show(typeKey) {
            var type = data.types[typeKey];
            if (!type) return;
            ['price', 'change', 'label', 'demand', 'growth', 'index', 'compare_price', 'compare_diff', 'compare_label', 'range', 'units', 'projects'].forEach(function (key) { set(key, type[key]); });
            var arc = card.querySelector('[data-k-arc]');
            if (arc) arc.setAttribute('stroke-dasharray', (type.index / 100 * 70.7).toFixed(1) + ' 94.2');
            type.bars.forEach(function (value, i) {
                var bar = card.querySelector('[data-bar="' + i + '"]');
                var label = card.querySelector('[data-bar-value="' + i + '"]');
                if (bar) bar.style.width = value + '%';
                if (label) label.textContent = value;
            });
            draw(type.series);
        }

        var buttons = Array.prototype.slice.call(card.querySelectorAll('[data-unit-type]'));
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                show(button.getAttribute('data-unit-type'));
            });
        });
        var current = card.querySelector('[data-unit-type][aria-pressed="true"]') || buttons[0];
        if (current) show(current.getAttribute('data-unit-type'));

        // سعر كل شهر مع تحريك الماوس أو الإصبع
        if (plot) {
            plot.addEventListener('pointermove', function (event) {
                if (!values.length) return;
                var box = plot.getBoundingClientRect();
                var ratio = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
                var i = Math.round(ratio * (values.length - 1));
                var x = i / (values.length - 1) * 100;
                plot.classList.add('is-active');
                cursor.setAttribute('x1', x);
                cursor.setAttribute('x2', x);
                hoverDot.style.left = x + '%';
                hoverDot.style.top = toY(values[i]) + '%';
                hoverTip.innerHTML = data.months[i] + '<br><b>' + format(values[i]) + '</b> ' + data.perMeter;
                hoverTip.style.left = Math.min(78, Math.max(22, x)) + '%';
            });
            plot.addEventListener('pointerleave', function () { plot.classList.remove('is-active'); });
        }

        var how = card.querySelector('[data-index-how]');
        var bars = card.querySelector('[data-index-bars]');
        if (how && bars) {
            how.addEventListener('click', function () {
                var open = bars.hidden;
                bars.hidden = !open;
                how.setAttribute('aria-expanded', open ? 'true' : 'false');
                var arrow = how.querySelector('svg');
                if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
            });
        }

        var rings = card.querySelector('[data-map-rings]');
        card.querySelectorAll('[data-map-zoom]').forEach(function (button) {
            button.addEventListener('click', function () {
                // + و − : الدواير بتبدأ صغيرة وبتكبر لحد 3 مرات
                var zoom = parseFloat(rings.style.getPropertyValue('--zoom') || 1) + Number(button.getAttribute('data-map-zoom')) * 0.35;
                rings.style.setProperty('--zoom', Math.max(0.65, Math.min(3, zoom)));
            });
        });
    });



    /**
     * فلاتر المشاريع (areas/partials/filters.blade.php)
     * - [data-sheet-open="اسم"] بيفتح اللوحة [data-filter-sheet="اسم"] (بتطلع من تحت). اللوحات: developer / project / area / price / all (صفحة "تصفية").
     * - "تطبيق" أو "عرض النتائج" [data-sheet-apply]: بيقفل اللوحة ويبعت الفورم. القفل من غير تطبيق بيرجّع الاختيار زي ما كان.
     * - لوحة مفتوحة من جوه صفحة "تصفية" (المنطقة / المطور): "تطبيق" بيرجع للصفحة من غير إرسال، والإرسال من "عرض النتائج".
     * - التبويب (وحدات المطور / إعادة البيع / للإيجار) بيغيّر الاختيارات: أي عنصر عليه data-modes بيظهر مع تبويباته بس، وحدود السعر والمساحة بتتغير من data-bounds.
     * - قبل الإرسال بيطلع حدث shary:filter على الفورم. امنعوه (preventDefault) لو هتجيبوا النتايج AJAX.
     * - صفحة البحث (search/partials/filters.blade.php):
     *   - الفلاتر السريعة: [data-sheet-open="section" data-sections="bedrooms bathrooms"] بيفتح لوحة من تحت فيها الأقسام دي نفسها
     *     (القسم [data-filter-section][data-key] بيتنقل للّوحة وبيرجع مكانه بعد القفل، فمفيش حقول متكررة). العدد: data-sheet-count="sec:bedrooms bathrooms".
     *   - الفورم اللي عليه data-filter-sidebar: على الديسك توب صفحة "تصفية" بتبقى عمود ثابت جنب النتايج، وأي تغيير فيه بيتبعت لوحده.
     */
    document.querySelectorAll('[data-area-filters]').forEach(function (form) {
        var STEPS = 1000;
        var stack = [];      // اللوحات المفتوحة فوق بعض
        var ranges = {};     // price / size

        function all(selector, root) { return Array.prototype.slice.call((root || form).querySelectorAll(selector)); }
        function sheet(name) { return form.querySelector('[data-filter-sheet="' + name + '"]'); }
        function commas(number) { return String(Math.round(number)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
        function digits(text) { return Number(String(text).replace(/[^\d]/g, '')) || 0; }
        function mode() { var picked = form.querySelector('input[name="offer"]:checked'); return picked ? picked.value : ''; }
        function bounds(range) { return range.bounds[mode()] || range.base; }

        // ---- شريط من–إلى: نفس المدى ممكن يكون مرسوم في أكتر من مكان، وكلهم بيتحركوا مع بعض
        function toValue(range, step) {
            if (step <= 0) return range.min;
            if (step >= STEPS) return range.max;
            if (!range.log) return Math.round(range.min + (range.max - range.min) * step / STEPS);
            var raw = range.min * Math.exp(Math.log(range.max / range.min) * step / STEPS);
            var unit = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10) - 1);
            return Math.round(raw / unit) * unit;
        }
        function toStep(range, value) {
            value = Math.max(range.min, Math.min(range.max, value));
            if (!range.log) return Math.round((value - range.min) / (range.max - range.min) * STEPS);
            return Math.round(Math.log(value / range.min) / Math.log(range.max / range.min) * STEPS);
        }
        function paint(range, skip) {
            var a = toStep(range, range.low);
            var b = toStep(range, range.high);
            range.views.forEach(function (view) {
                if (skip !== view.low) view.low.value = a;
                if (skip !== view.high) view.high.value = b;
                view.fill.style.insetInlineStart = (a / STEPS * 100) + '%';
                view.fill.style.insetInlineEnd = (100 - b / STEPS * 100) + '%';
                if (skip !== view.lowText) view.lowText.value = commas(range.low);
                if (skip !== view.highText) view.highText.value = commas(range.high);
            });
        }
        function commit(range) {
            range.minField.value = range.low > range.min ? range.low : '';
            range.maxField.value = range.high < range.max ? range.high : '';
        }
        function active(range) { return range.low > range.min || range.high < range.max; }

        all('[data-range]').forEach(function (root) {
            var name = root.getAttribute('data-range');
            var range = ranges[name];
            if (!range) {
                var extra = {};
                try { extra = JSON.parse(root.getAttribute('data-bounds') || '{}') || {}; } catch (error) { extra = {}; }
                range = ranges[name] = {
                    base: { min: Number(root.getAttribute('data-min')), max: Number(root.getAttribute('data-max')) }, bounds: Array.isArray(extra) ? {} : extra,
                    log: root.getAttribute('data-scale') === 'log',
                    minField: form.querySelector('[data-range-min="' + name + '"]'), maxField: form.querySelector('[data-range-max="' + name + '"]'), views: []
                };
                range.min = bounds(range).min;
                range.max = bounds(range).max;
                range.low = range.minField.value === '' ? range.min : Number(range.minField.value);
                range.high = range.maxField.value === '' ? range.max : Number(range.maxField.value);
            }
            var view = {
                low: root.querySelector('[data-range-low]'), high: root.querySelector('[data-range-high]'), fill: root.querySelector('[data-range-fill]'),
                lowText: root.querySelector('[data-range-low-text]'), highText: root.querySelector('[data-range-high-text]')
            };
            range.views.push(view);

            view.low.addEventListener('input', function () {
                if (Number(view.low.value) > Number(view.high.value) - 20) view.low.value = Number(view.high.value) - 20;
                range.low = toValue(range, Number(view.low.value));
                view.low.style.zIndex = 3; view.high.style.zIndex = 2;
                paint(range, view.low);
            });
            view.high.addEventListener('input', function () {
                if (Number(view.high.value) < Number(view.low.value) + 20) view.high.value = Number(view.low.value) + 20;
                range.high = toValue(range, Number(view.high.value));
                view.high.style.zIndex = 3; view.low.style.zIndex = 2;
                paint(range, view.high);
            });
            view.lowText.addEventListener('input', function () { view.lowText.value = commas(digits(view.lowText.value)); });
            view.highText.addEventListener('input', function () { view.highText.value = commas(digits(view.highText.value)); });
            view.lowText.addEventListener('change', function () { range.low = Math.max(range.min, Math.min(digits(view.lowText.value), range.high)); paint(range); });
            view.highText.addEventListener('change', function () { range.high = Math.min(range.max, Math.max(digits(view.highText.value) || range.max, range.low)); paint(range); });
        });
        Object.keys(ranges).forEach(function (name) { paint(ranges[name]); });

        // ---- التبويب بيحدد الاختيارات الظاهرة وحدود السعر والمساحة
        function applyMode() {
            var current = mode();
            all('[data-modes]').forEach(function (node) {
                var list = node.getAttribute('data-modes').trim();
                var shown = !list || list.split(' ').indexOf(current) > -1;
                node.classList.toggle('hidden', !shown);
                all('input', node).forEach(function (el) {
                    el.disabled = !shown;
                    if (!shown && (el.type === 'checkbox' || el.type === 'radio')) el.checked = false;
                });
            });
            Object.keys(ranges).forEach(function (name) {
                var range = ranges[name];
                var next = bounds(range);
                if (next.min !== range.min || next.max !== range.max) {
                    range.min = next.min; range.max = next.max;
                    range.low = next.min; range.high = next.max;
                }
                paint(range);
            });
        }
        all('input[name="offer"]').forEach(function (radio) { radio.addEventListener('change', function () { applyMode(); badges(); }); });

        // اختيار واحد ممكن يتشال بالضغط عليه تاني (مفروش / غير مفروش)
        all('[data-toggle-off]').forEach(function (radio) {
            radio.addEventListener('click', function () {
                if (radio.getAttribute('data-was') === '1') radio.checked = false;
                all('input[name="' + radio.name + '"]').forEach(function (other) { other.setAttribute('data-was', other.checked ? '1' : '0'); });
                badges();
            });
            radio.setAttribute('data-was', radio.checked ? '1' : '0');
        });

        // خانات الأرقام (المقدم / القسط): فواصل الآلاف وهو بيكتب
        all('[data-number]').forEach(function (input) {
            input.addEventListener('input', function () { input.value = digits(input.value) ? commas(digits(input.value)) : ''; });
        });

        // ---- حفظ الاختيار وقت الفتح عشان يرجع لو اللوحة اتقفلت من غير تطبيق
        function snapshot(root) {
            return {
                inputs: all('input', root).filter(function (el) { return el.type !== 'range' && el.type !== 'hidden'; }).map(function (el) { return [el, el.checked, el.value]; }),
                ranges: Object.keys(ranges).map(function (name) { return [name, ranges[name].low, ranges[name].high]; })
            };
        }
        function restore(state) {
            state.inputs.forEach(function (item) {
                if (item[0].type === 'checkbox' || item[0].type === 'radio') item[0].checked = item[1];
                else item[0].value = item[2];
            });
            applyMode();
            all('[data-toggle-off]').forEach(function (radio) { radio.setAttribute('data-was', radio.checked ? '1' : '0'); });
            state.ranges.forEach(function (item) { ranges[item[0]].low = item[1]; ranges[item[0]].high = item[2]; paint(ranges[item[0]]); });
        }

        // ---- عدد الاختيارات جنب اسم كل فلتر
        function section(key) { return form.querySelector('[data-filter-section][data-key="' + key + '"]'); }
        function count(name) {
            if (name === 'price') return ranges.price && active(ranges.price) ? 1 : 0;
            if (name.indexOf('sec:') === 0) {
                return name.slice(4).split(' ').reduce(function (total, key) {
                    return total + (section(key) ? all('input[type="checkbox"]:checked', section(key)).length : 0);
                }, 0);
            }
            if (name === 'all') {
                var page = sheet('all');
                if (!page) return 0;
                var total = all('input[type="checkbox"]:checked', page).length;
                total += all('[data-number]', page).filter(function (el) { return el.value !== ''; }).length;
                total += all('input[type="radio"]', page).filter(function (el, i) { return el.checked && i > 0; }).length;
                Object.keys(ranges).forEach(function (key) { if (active(ranges[key])) total++; });
                // لوحات الاختيار اللي بتتفتح من جوه الصفحة (في صفحة البحث: المشروع كمان)
                ['area', 'developer'].concat(form.hasAttribute('data-filter-sidebar') ? ['project'] : []).forEach(function (key) { if (sheet(key)) total += all('input:checked', sheet(key)).length; });
                return total;
            }
            return sheet(name) ? all('input[type="checkbox"]:checked', sheet(name)).length : 0;
        }
        function badges() {
            // شريط "الأسعار حسب الفلاتر اللي اخترتها" (صفحة البحث): ظاهر طول ما فيه فلتر مختار
            var notice = form.querySelector('[data-filter-notice]');
            if (notice) notice.classList.toggle('hidden', count('all') === 0);
            all('[data-sheet-count]').forEach(function (badge) {
                var name = badge.getAttribute('data-sheet-count');
                var total = count(name);
                badge.textContent = total ? (name === 'price' ? '✓' : total) : '';
                var opener = badge.closest('[data-sheet-open]');
                if (opener) opener.classList.toggle('is-active', total > 0);
            });
        }

        function submit() {
            var go = form.dispatchEvent(new CustomEvent('shary:filter', { bubbles: true, cancelable: true }));
            if (go) form.submit();
        }

        // after: بتتنفذ بعد القفل (وبعد ما تاريخ المتصفح يرجع خطوة) — "عرض النتائج" بتبعت الفورم منها
        function close(keep, after) {
            var top = stack.pop();
            if (!top) { if (after) after(); return; }
            if (!keep) restore(top.saved);
            top.node.classList.add('hidden');
            // الأقسام اللي اتنقلت للّوحة بترجع مكانها في صفحة "تصفية"
            (top.moved || []).forEach(function (item) { item.marker.parentNode.insertBefore(item.node, item.marker); item.marker.parentNode.removeChild(item.marker); });
            // لوحة المنطقة / المطور: البحث بيتمسح والقايمة بترجع لعمود الفلاتر (ديسك توب)
            resetListSearch(top.node);
            placeLists();
            top.opener.setAttribute('aria-expanded', 'false');
            if (!stack.length) document.documentElement.style.overflow = '';
            badges();
            top.opener.focus({ preventScroll: true });
            if (window.SharyBack) window.SharyBack.closed(after); else if (after) after();
        }

        all('[data-sheet-open]').forEach(function (opener) {
            opener.addEventListener('click', function () {
                var name = opener.getAttribute('data-sheet-open');
                var node = sheet(name);
                if (!node) return;
                closeSort();
                var moved = [];
                if (name === 'section') {
                    var body = node.querySelector('[data-section-body]');
                    (opener.getAttribute('data-sections') || '').split(' ').forEach(function (key) {
                        var part = key && section(key);
                        if (!part || !body) return;
                        var marker = document.createComment('section ' + key);
                        part.parentNode.insertBefore(marker, part);
                        body.appendChild(part);
                        moved.push({ node: part, marker: marker });
                    });
                    if (!moved.length) return;
                }
                // لوحة المنطقة / المطور: القايمة بترجع جوه اللوحة (لو كانت معروضة في عمود الفلاتر) قبل ما نحفظ الاختيار
                var listBody = form.querySelector('[data-list-body="' + name + '"]');
                var listHome = node.querySelector('[data-list-home]');
                if (listBody && listHome && listBody.parentNode !== listHome) listHome.appendChild(listBody);
                // صفحة "تصفية" بتحفظ الفورم كله، واللوحة الصغيرة بتحفظ اختياراتها بس
                stack.push({ node: node, opener: opener, moved: moved, saved: snapshot(name === 'all' ? form : node) });
                node.classList.remove('hidden');
                opener.setAttribute('aria-expanded', 'true');
                document.documentElement.style.overflow = 'hidden';
                // زرار الرجوع بيقفل اللوحة (زي X) والعميل بيفضل في الصفحة
                if (window.SharyBack) window.SharyBack.opened(function () { close(false); });
            });
        });
        all('[data-sheet-close]').forEach(function (node) { node.addEventListener('click', function () { close(false); }); });
        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            if (stack.length) close(false); else closeSort();
        });
        all('[data-sheet-apply]').forEach(function (button) {
            button.addEventListener('click', function () {
                Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                close(true, function () { if (!stack.length) submit(); });
            });
        });

        // ---- "مسح": لقسم واحد، أو لكل الفلاتر
        function clear(root) {
            all('input', root).forEach(function (el) {
                if (el.type === 'checkbox') el.checked = false;
                else if (el.type === 'radio' && el.name !== 'offer' && el.name !== 'sort') { el.checked = false; el.setAttribute('data-was', '0'); }
                else if (el.type === 'text') el.value = '';
            });
            all('[data-range]', root).forEach(function (node) {
                var range = ranges[node.getAttribute('data-range')];
                range.low = range.min; range.high = range.max; paint(range);
            });
        }
        all('[data-filter-clear]').forEach(function (button) {
            button.addEventListener('click', function () {
                var section = button.closest('[data-filter-section]');
                clear(section);
                (section.getAttribute('data-clears') || '').split(' ').forEach(function (name) { if (name && sheet(name)) clear(sheet(name)); });
                badges();
            });
        });
        all('[data-filter-clear-all]').forEach(function (button) {
            button.addEventListener('click', function () {
                all('[data-filter-sheet]').forEach(function (node) { clear(node); });
                var first = form.querySelector('input[name="offer"]');
                if (first) first.checked = true;
                all('[data-default-radio]').forEach(function (radio) { radio.checked = true; });   // تبويب الصفحة يرجع لـ "الكل"
                applyMode();
                badges();
                // "مسح الفلاتر" اللي بره اللوحات (فوق النتايج) بيمسح ويبعت على طول
                if (!button.closest('[data-filter-sheet]')) {
                    Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                    submit();
                }
            });
        });
        form.addEventListener('change', function (event) { if (event.target.type === 'checkbox' || event.target.type === 'radio' || event.target.hasAttribute('data-number')) badges(); });

        // ---- خانة البحث (Enter): نفس طريق "عرض النتائج"
        form.addEventListener('submit', function (event) { event.preventDefault(); submit(); });

        // ---- عمود الفلاتر الثابت (ديسك توب): أي تغيير بيتبعت لوحده بعد لحظة
        var sidebar = form.hasAttribute('data-filter-sidebar');
        var applyTimer = null;
        // عمود الفلاتر شغال لما الـ CSS يخلّي صفحة "تصفية" جزء من الصفحة (ديسك توب) بدل اللوحة اللي بتغطي الشاشة (موبايل)
        function wide() { var page = sheet('all'); return !!page && window.getComputedStyle(page).position !== 'fixed'; }

        // المنطقة / المطور: القايمة بتتعرض جوه العمود على الديسك توب، وبترجع للوحة الاختيار على الموبايل
        function placeLists() {
            all('[data-inline-list]').forEach(function (slot) {
                var name = slot.getAttribute('data-inline-list');
                var body = form.querySelector('[data-list-body="' + name + '"]');
                var home = sheet(name) && sheet(name).querySelector('[data-list-home]');
                if (!body || !home || !sheet(name).classList.contains('hidden')) return;   // اللوحة مفتوحة: القايمة بتفضل جواها
                var target = wide() ? slot : home;
                if (body.parentNode !== target) target.appendChild(body);
                // في العمود: المختار بيتعرض الأول (أول 3 بس ظاهرين، والباقي من "عرض المزيد")
                if (target === slot) {
                    Array.prototype.slice.call(body.children).filter(function (row) { var box = row.querySelector('input'); return box && box.checked; })
                        .reverse().forEach(function (row) { body.insertBefore(row, body.firstChild); });
                }
                var more = slot.parentNode.querySelector('[data-list-more]');
                if (more) more.classList.toggle('hidden', body.children.length <= 3);
            });
        }

        // خانة البحث جوه لوحة الاختيار: بتفلتر الصفوف بالاسم
        all('[data-list-search]').forEach(function (input) {
            input.addEventListener('input', function () {
                var words = input.value.trim().toLowerCase();
                all('label', input.closest('[data-filter-sheet]').querySelector('[data-list-body]') || input.closest('[data-filter-sheet]')).forEach(function (row) {
                    row.classList.toggle('hidden', words !== '' && row.textContent.toLowerCase().indexOf(words) === -1);
                });
            });
            input.addEventListener('keydown', function (event) { if (event.key === 'Enter') event.preventDefault(); });
        });
        function resetListSearch(node) {
            var input = node.querySelector('[data-list-search]');
            if (!input) return;
            input.value = '';
            all('label.hidden', node).forEach(function (row) { row.classList.remove('hidden'); });
        }
        function autoApply() {
            if (!sidebar || !wide() || stack.length) return;
            clearTimeout(applyTimer);
            applyTimer = setTimeout(function () {
                Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                badges();
                submit();
            }, 450);
        }
        if (sidebar) {
            placeLists();
            var resizeTimer = null;
            window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(placeLists, 120); });
            form.addEventListener('change', function (event) {
                var page = sheet('all');
                if (page && page.contains(event.target) && event.target.name !== 'sort') autoApply();
            });
            all('[data-filter-clear], [data-filter-clear-all]').forEach(function (button) { button.addEventListener('click', autoApply); });
        }

        // ---- الترتيب: قايمة تحت الزرار
        var sortOpen = form.querySelector('[data-sort-open]');
        var sortMenu = form.querySelector('[data-sort-menu]');
        function closeSort() {
            if (!sortMenu || sortMenu.classList.contains('hidden')) return;
            sortMenu.classList.add('hidden');
            sortOpen.setAttribute('aria-expanded', 'false');
        }
        if (sortOpen && sortMenu) {
            sortOpen.addEventListener('click', function () {
                var open = sortMenu.classList.toggle('hidden');
                sortOpen.setAttribute('aria-expanded', open ? 'false' : 'true');
            });
            document.addEventListener('click', function (event) {
                if (!sortMenu.contains(event.target) && !sortOpen.contains(event.target)) closeSort();
            });
            all('input[name="sort"]', sortMenu).forEach(function (radio) {
                radio.addEventListener('change', function () { closeSort(); sortOpen.classList.add('is-active'); submit(); });
            });
        }

        // اختيارات على الصفحة نفسها بتتبعت أول ما تتغير (تبويب الفرش في صفحة الإيجار)
        all('[data-submit-on-change]').forEach(function (input) { input.addEventListener('change', submit); });

        applyMode();
        Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
        badges();
    });
    // العروض: "عرض الكل" بيفرد كل العروض تحت بعض (زي قايمة بتتفتح)، و"عرض أقل" بيرجّع أول 3
    document.querySelectorAll('[data-offers]').forEach(function (section) {
        var toggle = section.querySelector('[data-offers-toggle]');
        var list = section.querySelector('[data-offers-list]');
        if (!toggle || !list) return;
        toggle.addEventListener('click', function () {
            var open = !list.classList.contains('is-open');
            list.classList.toggle('is-open', open);
            list.scrollLeft = 0;
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.querySelector('[data-label]').textContent = toggle.getAttribute(open ? 'data-less' : 'data-more');
            toggle.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
            if (!open) section.scrollIntoView({ block: 'nearest' });
        });
    });
    // خريطة جوجل جوه كارت المؤشر: بتتحمّل أول ما الكارت يظهر على الشاشة، وزرار السهمين بيكبّرها جوه نفس الصفحة ويرجّعها
    // لو الصفحة مفتوحة في مكان بيمنع تضمين خرائط جوجل (سياسة أمان الصفحة): الخريطة المرسومة بتفضل ظاهرة بدل مربع فاضي
    document.addEventListener('securitypolicyviolation', function (e) {
        if (String(e.violatedDirective || '').indexOf('frame') !== 0) return;
        document.querySelectorAll('[data-map-frame]').forEach(function (frame) {
            var box = frame.parentNode;
            box.classList.remove('is-live', 'is-expanded');
            box.classList.add('is-blocked');
            frame.hidden = true;
            var expand = box.querySelector('[data-map-expand]');
            if (expand) expand.hidden = true;
        });
    });

    document.querySelectorAll('[data-map-frame]').forEach(function (frame) {
        var box = frame.parentNode;
        function load() {
            if (frame.getAttribute('src') || box.classList.contains('is-blocked')) return;
            frame.addEventListener('load', function () { if (!box.classList.contains('is-blocked')) box.classList.add('is-live'); });
            frame.setAttribute('src', frame.getAttribute('data-src'));
        }
        // الخريطة تقيلة: بتتحمّل بعد ما الصفحة نفسها تخلص تحميل، ولما الكارت يقرّب يظهر على الشاشة
        function watch() {
            if ('IntersectionObserver' in window) {
                var seen = new IntersectionObserver(function (entries) {
                    if (entries[0].isIntersecting) { load(); seen.disconnect(); }
                }, { rootMargin: '200px' });
                seen.observe(box);
            } else {
                load();
            }
        }
        if (document.readyState === 'complete') watch(); else window.addEventListener('load', function () { setTimeout(watch, 300); });
        var expand = box.querySelector('[data-map-expand]');
        if (!expand) return;
        function setOpen(open) {
            if (open) load();
            box.classList.toggle('is-expanded', open);
            document.documentElement.style.overflow = open ? 'hidden' : '';
            expand.setAttribute('aria-expanded', open ? 'true' : 'false');
            expand.setAttribute('aria-label', expand.getAttribute(open ? 'data-close' : 'data-expand'));
            if (open) load();
        }
        expand.addEventListener('click', function () { setOpen(!box.classList.contains('is-expanded')); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('is-expanded')) setOpen(false); });
    });
})();

/**
 * صفحة المطور (developers/show.blade.php)
 * - "عرض الكل / عرض أقل" في مناطق المطور: بيفرد المناطق كلها بدل السحب الأفقي.
 * - "عرض أقل / عرض المزيد" في "عن المطور" بقى في js/shary/site-chrome.js (مشترك لكل الصفحات).
 * - "عرض المزيد" تحت المشاريع (موبايل): بيظهر 3 مشاريع كمان كل مرة.
 */
(function () {
    document.querySelectorAll('[data-dev-areas]').forEach(function (section) {
        var toggle = section.querySelector('[data-dev-areas-toggle]');
        var list = section.querySelector('[data-dev-areas-list]');
        if (!toggle || !list) return;
        toggle.addEventListener('click', function () {
            var open = !list.classList.contains('is-open');
            list.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.querySelector('[data-label]').textContent = toggle.getAttribute(open ? 'data-less' : 'data-more');
            toggle.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
        });
    });
})();

/**
 * صفحة نتايج البحث — التحميل وأنت نازل (من غير "عرض المزيد"):
 * - العنصر [data-infinite] تحت القايمة [data-results]. أول ما يقرب من الشاشة بيتطلب data-next-url ويتضاف اللي جوه [data-results] في الصفحة الجاية،
 *   وبيتاخد منها لينك الصفحة اللي بعدها. لينك فاضي = دي كل النتايج.
 * - الحالة على العنصر: data-state="idle | loading | done | error" (الـ CSS بيظهر "جاري التحميل" أو "دي كل النتايج").
 * - حدث shary:load-more ({ url, append(nodes, nextUrl) }): امنعوه (preventDefault) لو هتجيبوا النتايج بطريقتكم ونادوا append.
 * - لو بدّلتوا النتايج من غير تحميل الصفحة (فلترة AJAX): ابعتوا على [data-infinite] حدث shary:infinite-reset ({ nextUrl }) عشان التحميل يبدأ من الأول.
 *
 * خانة البحث (input name="q" جوه فورم الفلاتر): بتبحث باسم الكمبوند أو المطور أو المنطقة.
 * - Enter (أو زرار "بحث" في كيبورد الموبايل) أو مسح الخانة بالـ ×: الفورم بيتبعت بنفس طريقة الفلاتر (حدث shary:filter وبعده GET فيه q).
 * - وهو بيكتب: قايمة اقتراحات تحت الخانة من قوايم الفلتر نفسها (المنطقة / المطور / المشروع بالصورة أو اللوجو). الضغط على اقتراح بيعلّم الاختيار ده في الفلتر ويبعت الفورم
 *   (يعني area[] / developer[] / project[] — من غير أي endpoint جديد). الأسهم + Enter بيشتغلوا، و Esc بيقفل القايمة.
 * - وهو بيكتب كمان: حدث shary:search ({ q }) على الفورم بعد ما يقف كتابة — اسمعوه لو عايزين نتايج لايف من غير Enter.
 */
(function () {
    document.querySelectorAll('[data-infinite]').forEach(function (sentinel) {
        var list = sentinel.parentNode.querySelector('[data-results]');
        if (!list) return;
        var busy = false;
        var observer = null;
        var run = 0;   // بيزيد مع كل shary:infinite-reset عشان أي تحميل قديم لسه راجع يتجاهل

        function state(name) { sentinel.setAttribute('data-state', name); }

        function finish() {
            state('done');
            if (observer) { observer.disconnect(); observer = null; }
        }

        function append(nodes, nextUrl) {
            Array.prototype.slice.call(nodes || []).forEach(function (node) { list.appendChild(node); });
            if (window.SharyCards) window.SharyCards.refresh(list);
            sentinel.setAttribute('data-next-url', nextUrl || '');
            busy = false;
            if (!nextUrl || nextUrl === '#') { finish(); return; }
            state('idle');
            // لو العنصر لسه قريب من الشاشة بعد الإضافة (العميل واقف في آخر الصفحة) نكمّل تحميل
            setTimeout(function () { if (near()) load(); }, 60);
        }

        function near() {
            var box = sentinel.getBoundingClientRect();
            return box.height + box.width > 0 && box.top < window.innerHeight + 500 && box.bottom > -500;
        }

        function load() {
            if (busy || sentinel.getAttribute('data-state') === 'done') return;
            var url = sentinel.getAttribute('data-next-url');
            if (!url || url === '#') { finish(); return; }
            busy = true;
            state('loading');
            var mine = run;
            var detail = { url: url, append: function (nodes, nextUrl) { if (mine === run) append(nodes, nextUrl); } };
            if (!sentinel.dispatchEvent(new CustomEvent('shary:load-more', { bubbles: true, cancelable: true, detail: detail }))) return;
            fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(function (response) { if (!response.ok) throw new Error(response.status); return response.text(); })
                .then(function (html) {
                    var page = new DOMParser().parseFromString(html, 'text/html');
                    var incoming = page.querySelector('[data-results]');
                    var next = page.querySelector('[data-infinite]');
                    detail.append(incoming ? incoming.children : [], next ? next.getAttribute('data-next-url') : '');
                })
                .catch(function () { if (mine !== run) return; busy = false; state('error'); });
        }

        function watch() {
            if (observer) return;
            if ('IntersectionObserver' in window) {
                observer = new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) load(); }, { rootMargin: '500px 0px' });
                observer.observe(sentinel);
            } else if (!sentinel.getAttribute('data-scroll-bound')) {
                sentinel.setAttribute('data-scroll-bound', '1');
                window.addEventListener('scroll', function () { if (near()) load(); });
            }
        }

        function start() {
            busy = false;
            if (!sentinel.getAttribute('data-next-url') || sentinel.getAttribute('data-next-url') === '#') { finish(); return; }
            state('idle');
            watch();
            setTimeout(function () { if (near()) load(); }, 60);
        }

        var retry = sentinel.querySelector('[data-infinite-retry]');
        if (retry) retry.addEventListener('click', load);

        // النتايج اتبدّلت من غير تحميل الصفحة (فلترة AJAX): ابعتوا الحدث ده بلينك الصفحة اللي بعدها عشان التحميل يبدأ من الأول
        sentinel.addEventListener('shary:infinite-reset', function (event) {
            run++;
            sentinel.setAttribute('data-next-url', (event.detail && event.detail.nextUrl) || '');
            start();
        });

        start();
    });

    // ---- خانة البحث
    // توحيد النص: حروف صغيرة، من غير تشكيل، وتوحيد الألف والياء والتاء المربوطة — عشان "راس الحكمه" تلاقي "رأس الحكمة"
    function plain(text) {
        return String(text || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
            .replace(/[-_،,]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    document.querySelectorAll('form[data-area-filters] input[name="q"]').forEach(function (input) {
        var form = input.form;
        var bar = input.closest('.search-bar') || input.parentNode;
        var timer = null;
        var hideTimer = null;
        var sent = input.value;
        var panel = null;
        var shown = [];     // الاقتراحات الظاهرة
        var active = -1;    // الاقتراح المتعلّم بالأسهم

        function send() {
            clearTimeout(timer);
            hide();
            sent = input.value;
            // نفس طريق الفلاتر: area-page.js بيسمع submit ويطلع shary:filter. لو مفيش حد سمع، الفورم بيتبعت عادي
            var go = form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            if (go) form.submit();
        }

        // الاقتراحات من قوايم الفلتر نفسها (المنطقة / المطور / المشروع) — اختيار اقتراح = تعليم الاختيار ده في الفلتر وإرسال الفورم
        function options() {
            var out = [];
            ['area', 'developer', 'project'].forEach(function (kind) {
                Array.prototype.forEach.call(form.querySelectorAll('input[name="' + kind + '[]"]'), function (box) {
                    var row = box.closest('label');
                    if (!row || box.checked || box.disabled) return;
                    var nameNode = row.querySelector('[data-list-name]');
                    var name = (nameNode ? nameNode.textContent : row.textContent).trim();
                    // الصورة / اللوجو (ومعاه دايرة الحروف المختصرة اللي بتظهر لو اللوجو ما حملش)
                    var thumb = Array.prototype.filter.call(row.children, function (node) { return node !== nameNode && node !== box; });
                    out.push({ kind: kind, box: box, name: name, text: plain(name + ' ' + box.value), thumb: thumb });
                });
            });
            return out;
        }

        function hide() {
            clearTimeout(hideTimer);
            if (panel) panel.hidden = true;
            shown = [];
            active = -1;
            input.setAttribute('aria-expanded', 'false');
        }

        function mark(index) {
            active = index;
            shown.forEach(function (item, i) { item.node.classList.toggle('is-active', i === index); });
        }

        function choose(item) {
            item.box.checked = true;
            item.box.dispatchEvent(new Event('change', { bubbles: true }));
            input.value = '';
            input.blur();
            send();
        }

        function suggest() {
            var words = plain(input.value).split(' ').filter(Boolean);
            if (!words.length) { hide(); return; }
            var found = options().filter(function (item) { return words.every(function (word) { return item.text.indexOf(word) > -1; }); });
            // لحد 4 من كل نوع، و8 في المجموع
            var count = {};
            found = found.filter(function (item) { count[item.kind] = (count[item.kind] || 0) + 1; return count[item.kind] <= 4; }).slice(0, 8);
            if (!found.length) { hide(); return; }
            if (!panel) {
                panel = document.createElement('div');
                panel.className = 'search-suggest';
                panel.setAttribute('role', 'listbox');
                panel.setAttribute('aria-label', input.getAttribute('data-suggest-label') || '');
                bar.appendChild(panel);
            }
            panel.textContent = '';
            shown = found.map(function (item, index) {
                var node = document.createElement('button');
                node.type = 'button';
                node.className = 'search-suggest__row';
                node.setAttribute('role', 'option');
                var thumb = document.createElement('span');
                thumb.className = 'search-suggest__thumb';
                item.thumb.forEach(function (part) { thumb.appendChild(part.cloneNode(true)); });
                var name = document.createElement('span');
                name.className = 'search-suggest__name';
                name.textContent = item.name;
                var kind = document.createElement('span');
                kind.className = 'search-suggest__kind';
                kind.textContent = input.getAttribute('data-kind-' + item.kind) || '';
                node.appendChild(thumb); node.appendChild(name); node.appendChild(kind);
                node.addEventListener('mousedown', function (event) { event.preventDefault(); });   // الخانة تفضل متعلّمة لحد الضغطة
                node.addEventListener('click', function () { choose(item); });
                panel.appendChild(node);
                return { node: node, box: item.box };
            });
            active = -1;
            panel.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        }

        input.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                if (!shown.length) return;
                event.preventDefault();
                mark((active + (event.key === 'ArrowDown' ? 1 : shown.length - 1) + (active < 0 && event.key === 'ArrowUp' ? 1 : 0)) % shown.length);
            } else if (event.key === 'Escape' && shown.length) {
                event.stopPropagation();
                hide();
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (active > -1 && shown[active]) { choose(shown[active]); return; }
                input.blur();   // بيقفل كيبورد الموبايل
                send();
            }
        });
        // مسح الخانة بالـ × اللي جواها
        input.addEventListener('search', function () { if (input.value === '' && sent !== '') send(); });
        input.addEventListener('input', function () {
            suggest();
            clearTimeout(timer);
            timer = setTimeout(function () {
                form.dispatchEvent(new CustomEvent('shary:search', { bubbles: true, detail: { q: input.value.trim() } }));
            }, 350);
        });
        input.addEventListener('focus', suggest);
        input.addEventListener('blur', function () { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 180); });
    });
})();

/**
 * صفحة مؤشر شاري (shary-index/show.blade.php)
 * - نوع الوحدة (سكني / تجاري / ...): بيغيّر أرقام السوق، جملة الشهر، الرسم، جدول المناطق، "الأبرز هذا الشهر"،
 *   ميزانيتك تجيب إيه، الحاسبة، المقارنة وبدائل الاستثمار من غير تحميل الصفحة.
 *   الأرقام جاية من الـ JSON اللي في [data-index-data] (بيتكتب من الداتا في الـ Blade).
 * - رسم سعر المتر: المدة (3 شهور / سنة / 3 سنين)، وتحريك الماوس أو الإصبع عليه بيعرض سعر كل شهر.
 * - جدول المناطق: بحث بالاسم + ترتيب + "عرض كل المناطق".
 * - ميزانيتك تجيب إيه: المبلغ ÷ سعر المتر = المساحة في كل منطقة.
 * - حاسبة العائد: المقدم، القسط، القيمة المتوقعة، دخل الإيجار، العائد الإجمالي، استرداد رأس المال (أرقام تقديرية).
 * - قارن بين منطقتين: 6 مقارنات بشريطين على نفس المقياس.
 * - المنطقة (مصر كلها أو منطقة بعينها): أرقام الهيدر والرسم وجملة الشهر بتتبعها.
 * - اختيار المنطقة والترتيب بنفس تصميم الموقع: لوحة اختيار [data-index-picker] وقايمة ترتيب تحت الزرار — والقيمة في select مخفي.
 * كل تغيير بيبعت حدث shary:index-change ({ type, area, period, sort, query, a, b, budget, advanced }) لو الباك إند عايز يتابعه.
 */
(function () {
    function format(number) { return Math.round(Number(number)).toLocaleString('en-US'); }
    function percent(value, digits) { return (value >= 0 ? '+' : '−') + Math.abs(value).toFixed(digits === undefined ? 1 : digits) + '%'; }
    function digits(text) { return Number(String(text || '').replace(/[^\d.]/g, '')) || 0; }
    function plain(text) {
        return String(text || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();
    }

    document.querySelectorAll('[data-shary-index]').forEach(function (page) {
        var source = page.querySelector('[data-index-data]');
        if (!source) return;
        var data;
        try { data = JSON.parse(source.textContent); } catch (error) { return; }

        var trendTitle = page.querySelector('[data-k="trend_title"]');
        if (trendTitle) trendTitle.__default = trendTitle.textContent;
        var areas = {};
        data.areas.forEach(function (area) { areas[area.slug] = area; });
        var typeKey = Object.keys(data.types)[0];
        var areaKey = '';   // '' = مصر كلها ، أو slug منطقة: أرقام الهيدر والرسم بتتبعه
        var period = 12;    // عدد الشهور في الرسم
        var limit = 8;      // عدد المناطق الظاهرة قبل "عرض كل المناطق"

        // ---------- أرقام السوق + الرسم ----------
        var plot = page.querySelector('[data-plot]');
        var line = page.querySelector('[data-plot-line]');
        var fill = page.querySelector('[data-plot-area]');
        var cursor = page.querySelector('[data-plot-cursor]');
        var endDot = page.querySelector('[data-plot-end]');
        var endTip = page.querySelector('[data-plot-end-tip]');
        var hoverDot = page.querySelector('[data-plot-dot]');
        var hoverTip = page.querySelector('[data-plot-tip]');
        var table = page.querySelector('[data-plot-table]');
        var values = [];
        var labels = [];
        var toY = function () { return 0; };

        function draw() {
            if (!plot) return;
            // آخر N شهر (+ الشهر اللي قبلهم عشان نسبة التغير تتحسب من أول المدة)
            var all = scope().series;
            var count = Math.min(all.length, period === 36 ? 36 : period + 1);
            values = all.slice(-count);
            labels = data.months.slice(-count);
            var min = Math.min.apply(null, values);
            var max = Math.max.apply(null, values);
            var pad = (max - min) * 0.25 || 1;
            var low = min - pad * 0.2;
            toY = function (value) { return 90 - ((value - low) / (max + pad - low)) * 80; };
            var points = values.map(function (value, i) { return (i / (values.length - 1) * 100).toFixed(2) + ',' + toY(value).toFixed(2); });
            line.setAttribute('d', 'M' + points.join('L'));
            fill.setAttribute('d', 'M' + points.join('L') + 'L100,100L0,100Z');
            var last = values[values.length - 1];
            endDot.style.left = '100%';
            endDot.style.top = toY(last) + '%';
            endTip.style.top = toY(last) + '%';
            endTip.textContent = format(last);
            table.innerHTML = '<caption>' + data.caption + '</caption>' + values.map(function (value, i) {
                return '<tr><th>' + labels[i] + '</th><td>' + format(value) + '</td></tr>';
            }).join('');

            var text = function (selector, value) { var el = page.querySelector(selector); if (el) el.textContent = value; };
            text('[data-plot-from]', labels[0]);
            text('[data-plot-mid]', labels[Math.floor((labels.length - 1) / 2)]);
            text('[data-plot-to]', labels[labels.length - 1]);
            var change = (last / values[0] - 1) * 100;
            text('[data-period-value]', percent(change));
            var pill = page.querySelector('[data-period-change]');
            if (pill) pill.setAttribute('data-sign', change >= 0 ? 'up' : 'down');
        }

        if (plot) {
            plot.addEventListener('pointermove', function (event) {
                if (!values.length) return;
                var box = plot.getBoundingClientRect();
                var ratio = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
                var i = Math.round(ratio * (values.length - 1));
                var x = i / (values.length - 1) * 100;
                plot.classList.add('is-active');
                cursor.setAttribute('x1', x);
                cursor.setAttribute('x2', x);
                hoverDot.style.left = x + '%';
                hoverDot.style.top = toY(values[i]) + '%';
                hoverTip.innerHTML = labels[i] + '<br><b>' + format(values[i]) + '</b> ' + data.perMeter;
                hoverTip.style.left = Math.min(78, Math.max(22, x)) + '%';
            });
            plot.addEventListener('pointerleave', function () { plot.classList.remove('is-active'); });
        }

        var periods = Array.prototype.slice.call(page.querySelectorAll('[data-index-period]'));
        periods.forEach(function (button) {
            button.addEventListener('click', function () {
                periods.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                period = Number(button.getAttribute('data-index-period')) || 12;
                draw();
                announce();
            });
        });

        function set(key, value) {
            page.querySelectorAll('[data-k="' + key + '"]').forEach(function (el) { el.textContent = value; });
        }

        // أرقام الاختيار الحالي: السوق كله (مصر) أو منطقة بعينها — نفس المفاتيح في الحالتين
        function scope() {
            var type = data.types[typeKey];
            if (!areaKey || !areas[areaKey]) {
                var market = type.market;
                return { name: data.scopeAll, price_text: market.price_text, yearly_text: market.yearly_text, monthly_text: market.monthly_text, yield_text: market.yield_text,
                    units_text: market.units_text, demand: market.demand, range_label: data.range, range_text: market.range_text, series: market.series,
                    headline: data.headlines[typeKey] || '', insights: data.insights[typeKey] || [] };
            }
            var area = areas[areaKey];
            var v = area.values[typeKey];
            // سعر المتر لآخر 3 سنين للمنطقة: من السعر الحالي ونسبة الزيادة السنوية (في الموقع بييجي من المؤشر جاهز)
            var end = v.price, parts = [];
            [v.yearly, v.yearly * 0.85, v.yearly * 0.7].forEach(function (rate) {
                var start = end / (1 + rate / 100);
                parts.unshift(data.weights.map(function (w) { return Math.round((start + (end - start) * w) / 100) * 100; }));
                end = start;
            });
            var fill = function (text, map) { return Object.keys(map).reduce(function (out, key) { return out.replace(':' + key, map[key]); }, text); };
            return { name: area.name, price_text: v.price_text, yearly_text: v.yearly_text, monthly_text: v.monthly_text, yield_text: v.yield_text,
                units_text: v.units_text, demand: v.demand, range_label: data.resaleRange, range_text: v.resale_text, series: parts[0].concat(parts[1], parts[2]),
                headline: fill(data.headlineArea, { type: type.label_in, area: area.name, price: v.price_text, yearly: v.yearly_text, verdict: v.verdict_text }),
                insights: [fill(data.insightYield, { value: v.yield_text }), fill(data.insightResale, { value: v.resale_diff_text }), fill(data.insightDemand, { demand: v.demand, units: v.units_text })] };
        }

        function showMarket() {
            var type = data.types[typeKey];
            var now = scope();
            set('label', type.label);
            set('label_in_units', type.label);
            set('scope', now.name);
            set('headline', now.headline);
            set('trend_title', areaKey ? data.trendTitleIn.replace(':area', now.name) : (page.querySelector('[data-k="trend_title"]') || {}).__default || '');
            set('price', now.price_text);
            set('yearly', now.yearly_text);
            set('monthly', now.monthly_text);
            set('yield', now.yield_text);
            set('units', now.units_text);
            set('demand', now.demand);
            set('range_label', now.range_label);
            set('range', now.range_text);
            draw();

            var insights = page.querySelector('[data-insights]');
            if (insights) {
                insights.textContent = '';
                now.insights.forEach(function (text) {
                    var li = document.createElement('li');
                    li.textContent = text;
                    insights.appendChild(li);
                });
            }
        }

        // ---------- جدول المناطق ----------
        var section = page.querySelector('[data-index-areas]');
        var body = page.querySelector('[data-index-rows]');
        var rows = body ? Array.prototype.slice.call(body.querySelectorAll('tr[data-slug]')) : [];
        var search = page.querySelector('[data-index-search]');
        var sort = page.querySelector('[data-index-sort]');
        var more = page.querySelector('[data-index-more]');
        var empty = page.querySelector('[data-index-empty]');
        var expanded = false;
        // الفلتر المتقدم المتطبّق على الجدول: الجهة / التقييم / أقل نمو سنوي / أقل عائد إيجار
        var adv = { group: '', verdict: '', growth: 0, yield: 0 };
        function advMatch(slug, filter) {
            var area = areas[slug], v = area.values[typeKey];
            return (!filter.group || area.group_key === filter.group) && (!filter.verdict || v.verdict === filter.verdict) && v.yearly >= filter.growth && v.yield >= filter.yield;
        }
        function advOn(filter) { return !!(filter.group || filter.verdict || filter.growth || filter.yield); }

        function fillRows() {
            rows.forEach(function (row) {
                var v = areas[row.getAttribute('data-slug')].values[typeKey];
                var cell = function (name) { return row.querySelector('[data-c="' + name + '"]'); };
                var put = function (name, value) { var el = cell(name); if (el) el.textContent = value; };
                put('price', v.price_text);
                put('yield', v.yield_text);
                put('units', v.units_text);
                put('demand', v.demand);
                put('verdict', v.verdict_text);
                if (cell('verdict')) cell('verdict').setAttribute('data-verdict', v.verdict);
                [['yearly', v.yearly, v.yearly_text], ['resale_diff', v.resale_diff, v.resale_diff_text]].forEach(function (entry) {
                    var el = cell(entry[0]);
                    if (!el) return;
                    el.textContent = entry[2];
                    el.setAttribute('data-sign', entry[1] >= 0 ? 'up' : 'down');
                });
                var bar = row.querySelector('[data-c-bar="demand"]');
                if (bar) bar.style.width = v.demand + '%';
            });
        }

        function arrange() {
            if (!body) return;
            var by = sort ? sort.value : 'price';
            var query = plain(search ? search.value : '');
            rows.sort(function (x, y) {
                if (by === 'name') return x.getAttribute('data-name').localeCompare(y.getAttribute('data-name'), document.documentElement.lang || 'ar');
                return areas[y.getAttribute('data-slug')].values[typeKey][by] - areas[x.getAttribute('data-slug')].values[typeKey][by];
            });
            var shown = 0;
            rows.forEach(function (row) {
                body.appendChild(row);
                var match = (!query || plain(row.getAttribute('data-name')).indexOf(query) !== -1) && advMatch(row.getAttribute('data-slug'), adv);
                var visible = match && (expanded || query || advOn(adv) || shown < limit);
                if (match) shown++;
                row.hidden = !visible;
                if (visible) row.querySelector('[data-c="rank"]').textContent = shown;
            });
            if (empty) {
                empty.textContent = advOn(adv) ? data.advNone : data.noAreas;
                empty.classList.toggle('hidden', shown > 0);
            }
            if (more) more.classList.toggle('hidden', !!query || advOn(adv) || rows.length <= limit);
        }

        if (search) search.addEventListener('input', function () { arrange(); announce(); });
        if (sort) sort.addEventListener('change', function () { arrange(); announce(); });
        if (more) {
            more.addEventListener('click', function () {
                expanded = !expanded;
                more.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                more.querySelector('[data-label]').textContent = more.getAttribute(expanded ? 'data-less' : 'data-more');
                more.querySelector('svg').style.transform = expanded ? 'rotate(180deg)' : '';
                arrange();
                if (!expanded && section) section.scrollIntoView({ block: 'nearest' });
            });
        }

        // ---------- الأبرز هذا الشهر ----------
        function showMovers() {
            var field = { growth: 'yearly_text', yield: 'yield_text', demand: 'demand', value: 'price_text' };
            page.querySelectorAll('[data-movers]').forEach(function (list) {
                var kind = list.getAttribute('data-movers');
                var items = Array.prototype.slice.call(list.children);
                (data.movers[typeKey][kind] || []).forEach(function (slug, i) {
                    var item = items[i];
                    if (!item) return;
                    var name = item.querySelector('[data-mover-name]');
                    name.textContent = areas[slug].name;
                    if (areas[slug].url) name.setAttribute('href', areas[slug].url);
                    item.querySelector('[data-mover-value]').textContent = areas[slug].values[typeKey][field[kind]];
                });
            });
        }

        // ---------- ميزانيتك تجيب إيه ----------
        var budget = page.querySelector('[data-index-budget]');
        var budgetInput = budget ? budget.querySelector('[data-budget-input]') : null;
        function showBudget() {
            if (!budget || !budgetInput) return;
            var amount = digits(budgetInput.value);
            var list = budget.querySelector('[data-budget-results]');
            var none = budget.querySelector('[data-budget-empty]');
            // المساحة = المبلغ ÷ سعر المتر (للحساب بس، مش بتتعرض). بنعرض أغلى 6 مناطق المبلغ يجيب فيها 60 م² أو أكتر (أحسن منطقة تقدر عليها الأول)،
            // ولو مفيش: المناطق اللي يجيب فيها 40 م² على الأقل
            var all = data.areas.map(function (area) {
                var price = area.values[typeKey].price;
                return { area: area, price: price, size: Math.floor(amount / price) };
            });
            var options = all.filter(function (option) { return option.size >= 60; });
            if (!options.length) options = all.filter(function (option) { return option.size >= 40; });
            options = options.sort(function (x, y) { return y.price - x.price; }).slice(0, 6);
            list.textContent = '';
            options.forEach(function (option) {
                var item = document.createElement('li');
                item.className = 'index-budget__item card-stretch';
                // اسم المنطقة بس وجنبه صورتها (من غير سعر متر ولا مساحة). الصورة من صف المنطقة في لوحة الاختيار
                var row = page.querySelector('[data-index-picker] input[name="index-area-pick"][value="' + option.area.slug + '"]');
                var shown = row ? row.closest('label').querySelector('img') : null;
                if (shown) {
                    var image = document.createElement('img');
                    image.className = 'index-budget__image';
                    image.alt = '';
                    image.loading = 'lazy';
                    image.setAttribute('data-fallback', shown.getAttribute('data-fallback') || '');
                    image.onerror = function () { this.onerror = null; this.src = this.getAttribute('data-fallback'); };
                    image.src = shown.currentSrc || shown.getAttribute('src');
                    item.appendChild(image);
                }
                var name = document.createElement(option.area.url ? 'a' : 'span');
                if (option.area.url) name.setAttribute('href', option.area.url);
                name.className = 'index-budget__name' + (option.area.url ? ' card-link' : '');
                name.textContent = option.area.name;
                item.appendChild(name);
                list.appendChild(item);
            });
            none.classList.toggle('hidden', options.length > 0);
            budget.querySelectorAll('[data-budget-chip]').forEach(function (chip) {
                chip.setAttribute('aria-pressed', Number(chip.getAttribute('data-budget-chip')) === amount ? 'true' : 'false');
            });
        }
        if (budgetInput) {
            budgetInput.addEventListener('input', function () {
                var amount = digits(budgetInput.value);
                budgetInput.value = amount ? format(amount) : '';
                showBudget();
                announce();
            });
            budget.querySelectorAll('[data-budget-chip]').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    budgetInput.value = format(chip.getAttribute('data-budget-chip'));
                    showBudget();
                    announce();
                });
            });
        }

        // ---------- حاسبة العائد ----------
        var calc = page.querySelector('[data-index-calc]');
        function field(name) { return calc ? calc.querySelector('[data-calc="' + name + '"]') : null; }
        function calcDefaults() {
            // النمو والعائد بيتملوا من أرقام المنطقة المختارة (والعميل يقدر يغيّرهم)
            var area = areas[field('area').value];
            if (!area) return;
            field('growth').value = area.values[typeKey].yearly;
            field('yield').value = area.values[typeKey].yield;
        }
        function showCalc() {
            if (!calc) return;
            var price = digits(field('price').value);
            var down = Math.min(100, digits(field('down').value)) / 100;
            var years = Math.max(1, digits(field('years').value));
            var hold = Math.max(1, digits(field('hold').value));
            var growth = digits(field('growth').value) / 100;
            var rentYield = digits(field('yield').value) / 100;
            var value = price * Math.pow(1 + growth, hold);
            var gain = value - price;
            var rent = price * rentYield * hold;
            var out = function (name, text) { var el = calc.querySelector('[data-calc-out="' + name + '"]'); if (el) el.textContent = text; };
            out('down', format(price * down) + ' ' + data.egp);
            out('installment', format(price * (1 - down) / (years * 12)) + ' ' + data.egp);
            out('value', format(value) + ' ' + data.egp);
            out('gain', format(gain) + ' ' + data.egp);
            out('rent', format(rent) + ' ' + data.egp);
            out('payback', rentYield > 0 ? (1 / rentYield).toFixed(1) + ' ' + data.yearsUnit : '—');
            out('total', price > 0 ? percent((gain + rent) / price * 100, 0) : '—');
            var label = calc.querySelector('[data-calc-label="value"]');
            if (label) label.textContent = data.outValue.replace(':years', hold);
        }
        if (calc) {
            calc.querySelectorAll('[data-calc]').forEach(function (input) {
                input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', function () {
                    if (input.getAttribute('data-calc') === 'area') calcDefaults();
                    if (input.getAttribute('data-calc') === 'price') {
                        var amount = digits(input.value);
                        input.value = amount ? format(amount) : '';
                    }
                    showCalc();
                });
            });
        }

        // ---------- قارن بين منطقتين ----------
        var compare = page.querySelector('[data-index-compare]');
        function picked(side) {
            var select = compare ? compare.querySelector('[data-compare-select="' + side + '"]') : null;
            return select ? select.value : '';
        }
        function showCompare() {
            if (!compare) return;
            var a = areas[picked('a')];
            var b = areas[picked('b')];
            if (!a || !b) return;
            compare.querySelectorAll('[data-compare-metric]').forEach(function (block) {
                var metric = block.getAttribute('data-compare-metric');
                var va = a.values[typeKey][metric];
                var vb = b.values[typeKey][metric];
                // الشريطين على نفس المقياس: من صفر لـ 100 (الطلب والمؤشر) أو لأكبر رقم في الاتنين (الباقي)
                var top = metric === 'demand' || metric === 'score' ? 100 : Math.max(Math.abs(va), Math.abs(vb)) || 1;
                [['a', a, va], ['b', b, vb]].forEach(function (entry) {
                    var value = entry[2];
                    block.querySelector('[data-compare-name="' + entry[0] + '"]').textContent = entry[1].name;
                    block.querySelector('[data-compare-bar="' + entry[0] + '"]').style.width = Math.max(2, Math.abs(value) / top * 100) + '%';
                    block.querySelector('[data-compare-value="' + entry[0] + '"]').textContent =
                        metric === 'price' || metric === 'resale' ? format(value) : metric === 'yearly' ? percent(value) : metric === 'yield' ? value.toFixed(1) + '%' : value;
                });
            });
        }
        if (compare) {
            compare.querySelectorAll('[data-compare-select]').forEach(function (select) {
                select.addEventListener('change', function () { showCompare(); announce(); });
            });
        }

        // ---------- مليون جنيه من سنة بقوا كام؟ ----------
        function showAlternatives() {
            var holder = page.querySelector('[data-alt-rows]');
            var list = data.alternatives[typeKey] || [];
            if (!holder || !list.length) return;
            var top = Math.max.apply(null, list.map(function (item) { return item.rate; }));
            Array.prototype.slice.call(holder.children).forEach(function (row, i) {
                var item = list[i];
                if (!item) return;
                row.querySelector('span').textContent = item.label;
                row.querySelector('i').style.width = ((100 + item.rate) / (100 + top) * 100).toFixed(1) + '%';
                row.querySelector('b').textContent = format(1000000 * (1 + item.rate / 100));
            });
        }

        function announce() {
            page.dispatchEvent(new CustomEvent('shary:index-change', { bubbles: true, detail: {
                type: typeKey, area: areaKey, period: period, sort: sort ? sort.value : 'price', query: search ? search.value : '',
                a: picked('a'), b: picked('b'), budget: budgetInput ? digits(budgetInput.value) : 0, advanced: adv
            } }));
        }

        function show() {
            showMarket();
            fillRows();
            arrange();
            showMovers();
            showBudget();
            if (calc) { calcDefaults(); showCalc(); }
            showCompare();
            showAlternatives();
        }

        var buttons = Array.prototype.slice.call(page.querySelectorAll('[data-index-type]'));
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                typeKey = button.getAttribute('data-index-type');
                show();
                announce();
            });
        });
        var areaSelect = page.querySelector('[data-index-area]');
        if (areaSelect) {
            areaSelect.addEventListener('change', function () {
                areaKey = areaSelect.value;
                showMarket();
                announce();
            });
        }
        // ---------- الترتيب: زرار + قايمة تحته (نفس تصميم صفحة المنطقة). الاختيار بيتكتب في الـ select المخفي ----------
        var sortOpen = page.querySelector('[data-index-sort-open]');
        var sortMenu = page.querySelector('[data-index-sort-menu]');
        if (sortOpen && sortMenu && sort) {
            var closeSort = function () { sortMenu.classList.add('hidden'); sortOpen.setAttribute('aria-expanded', 'false'); };
            sortOpen.addEventListener('click', function () {
                var closed = sortMenu.classList.toggle('hidden');
                sortOpen.setAttribute('aria-expanded', closed ? 'false' : 'true');
                // علّم الاختيار الحالي كل مرة القايمة تتفتح
                sortMenu.querySelectorAll('input[type="radio"]').forEach(function (radio) { radio.checked = radio.value === sort.value; });
            });
            document.addEventListener('click', function (event) {
                if (!sortMenu.contains(event.target) && !sortOpen.contains(event.target)) closeSort();
            });
            sortMenu.querySelectorAll('input[type="radio"]').forEach(function (radio) {
                radio.addEventListener('change', function () {
                    sort.value = radio.value;
                    var label = page.querySelector('[data-index-sort-label]');
                    if (label) label.textContent = radio.parentNode.querySelector('span').textContent;
                    closeSort();
                    sort.dispatchEvent(new Event('change'));
                });
            });
        }

        // ---------- جدول أنواع الوحدات: الضغط على النوع بيغيّر الصفحة كلها للنوع ده ويطلع للفلتر ----------
        page.querySelectorAll('[data-index-type-jump]').forEach(function (jump) {
            jump.addEventListener('click', function () {
                var target = page.querySelector('[data-index-type="' + jump.getAttribute('data-index-type-jump') + '"]');
                if (!target) return;
                target.click();
                var filter = page.querySelector('[data-index-filter]');
                if (filter) filter.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });

        // ---------- الفلتر المتقدم: لوحة بتصميم الموقع، الاختيارات مسودة لحد ما يضغط "اعرض" ----------
        var advDialog = page.querySelector('[data-index-advanced]');
        var advOpen = page.querySelector('[data-adv-open]');
        if (advDialog && advOpen) {
            var draft = { group: '', verdict: '', growth: 0, yield: 0 };
            var advChips = Array.prototype.slice.call(advDialog.querySelectorAll('[data-adv-chip]'));
            var advApply = advDialog.querySelector('[data-adv-apply]');
            var advActive = page.querySelector('[data-adv-active]');
            var chipValue = function (chip) {
                var key = chip.getAttribute('data-adv-chip'), value = chip.getAttribute('data-adv-value');
                return key === 'growth' || key === 'yield' ? Number(value) : value;
            };
            var paintDraft = function () {
                advChips.forEach(function (chip) { chip.setAttribute('aria-pressed', draft[chip.getAttribute('data-adv-chip')] === chipValue(chip) ? 'true' : 'false'); });
                var count = rows.filter(function (row) { return advMatch(row.getAttribute('data-slug'), draft); }).length;
                advApply.textContent = advApply.getAttribute('data-label').replace(':count', count);
            };
            var paintApplied = function () {
                var labels = advChips.filter(function (chip) { return chip.getAttribute('data-adv-label') && adv[chip.getAttribute('data-adv-chip')] === chipValue(chip); })
                    .map(function (chip) { return chip.getAttribute('data-adv-label'); });
                var badge = advOpen.querySelector('[data-adv-count]');
                if (badge) { badge.textContent = labels.length; badge.classList.toggle('hidden', !labels.length); }
                if (advActive) {
                    advActive.classList.toggle('hidden', !labels.length);
                    advActive.querySelector('[data-adv-summary]').textContent = labels.join(' · ');
                }
            };
            var closeAdv = function () { advDialog.classList.add('hidden'); document.documentElement.style.overflow = ''; advOpen.focus(); };
            advOpen.addEventListener('click', function () {
                draft = { group: adv.group, verdict: adv.verdict, growth: adv.growth, yield: adv.yield };
                paintDraft();
                advDialog.classList.remove('hidden');
                document.documentElement.style.overflow = 'hidden';
            });
            advChips.forEach(function (chip) {
                chip.addEventListener('click', function () { draft[chip.getAttribute('data-adv-chip')] = chipValue(chip); paintDraft(); });
            });
            advDialog.querySelectorAll('[data-adv-close]').forEach(function (button) { button.addEventListener('click', closeAdv); });
            advDialog.querySelector('[data-adv-reset]').addEventListener('click', function () { draft = { group: '', verdict: '', growth: 0, yield: 0 }; paintDraft(); });
            advApply.addEventListener('click', function () {
                adv = draft;
                arrange(); paintApplied(); closeAdv(); announce();
                if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            var advClear = page.querySelector('[data-adv-clear]');
            if (advClear) advClear.addEventListener('click', function () { adv = { group: '', verdict: '', growth: 0, yield: 0 }; arrange(); paintApplied(); announce(); });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !advDialog.classList.contains('hidden')) closeAdv(); });
        }

        // ---------- أخبار السوق: تصفية بنوع الخبر (الكل / طروحات / أسعار / تسليمات / قرارات) ----------
        var newsFilters = page.querySelectorAll('[data-news-filter]');
        if (newsFilters.length) {
            var newsItems = page.querySelectorAll('[data-news-kind]');
            var newsEmpty = page.querySelector('[data-news-empty]');
            newsFilters.forEach(function (button) {
                button.addEventListener('click', function () {
                    var kind = button.getAttribute('data-news-filter');
                    var shown = 0;
                    newsFilters.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                    newsItems.forEach(function (item) {
                        var match = kind === 'all' || item.getAttribute('data-news-kind') === kind;
                        item.classList.toggle('hidden', !match);
                        if (match) shown += 1;
                    });
                    if (newsEmpty) newsEmpty.classList.toggle('hidden', shown > 0);
                    document.dispatchEvent(new CustomEvent('shary:news-filter', { detail: { kind: kind } }));
                });
            });
        }

        // ---------- لوحة اختيار المنطقة (نفس تصميم لوحات الاختيار في الموقع) ----------
        // أي زرار [data-picker-open] بيفتحها، والاختيار بيتكتب في الـ select المخفي اللي جنب الزرار وبيحدّث اسم الزرار
        var picker = page.querySelector('[data-index-picker]');
        if (picker) {
            var target = null;      // الزرار اللي فتح اللوحة
            var pickerSearch = picker.querySelector('[data-picker-search]');
            var options = Array.prototype.slice.call(picker.querySelectorAll('[data-picker-list] label'));
            var holder = function (button) { return button.parentNode.querySelector('select'); };
            // زرار الهيدر بيعرض صورة المنطقة + الاسم، وباقي الأزرار (المقارنة والحاسبة) الاسم بس
            var paint = function (button) {
                var slug = holder(button).value;
                var image = button.querySelector('[data-pick-image]');
                button.querySelector('[data-pick-name]').textContent = slug ? areas[slug].name : data.scopeAll;
                if (!image) return;
                if (!slug) {
                    image.src = image.getAttribute('data-all') || image.src;
                    image.classList.add('index-pick__mark');
                    return;
                }
                // الصورة بتتاخد من صف المنطقة في اللوحة نفسها
                var row = picker.querySelector('input[name="index-area-pick"][value="' + slug + '"]');
                var shown = row ? row.closest('label').querySelector('img') : null;
                var fallback = (shown && shown.getAttribute('data-fallback')) || areas[slug].image_fallback || '';
                image.classList.remove('index-pick__mark');
                image.setAttribute('data-fallback', fallback);
                image.onerror = function () { image.onerror = null; image.src = image.getAttribute('data-fallback'); };
                image.src = (shown && (shown.currentSrc || shown.getAttribute('src'))) || areas[slug].image || fallback;
            };
            var closePicker = function () {
                picker.classList.add('hidden');
                document.documentElement.style.overflow = '';
                if (target) target.focus();
                target = null;
            };
            page.querySelectorAll('[data-picker-open]').forEach(function (button) {
                var image = button.querySelector('[data-pick-image]');
                if (image && !holder(button).value) { image.setAttribute('data-all', image.getAttribute('src')); image.classList.add('index-pick__mark'); }
                button.addEventListener('click', function () {
                    target = button;
                    var value = holder(button).value;
                    var all = picker.querySelector('[data-picker-all]');
                    if (all) all.classList.toggle('hidden', !holder(button).querySelector('option[value=""]'));
                    options.forEach(function (row) { row.querySelector('input').checked = row.querySelector('input').value === value; if (row !== all) row.classList.remove('hidden'); });
                    if (pickerSearch) pickerSearch.value = '';
                    picker.classList.remove('hidden');
                    document.documentElement.style.overflow = 'hidden';
                });
            });
            options.forEach(function (row) {
                // click مش change: عشان اللوحة تتقفل حتى لو اختار نفس المنطقة المختارة
                row.querySelector('input').addEventListener('click', function () {
                    if (!target) return;
                    var select = holder(target);
                    select.value = row.querySelector('input').value;
                    paint(target);
                    closePicker();
                    select.dispatchEvent(new Event('change'));
                });
            });
            picker.querySelectorAll('[data-picker-close]').forEach(function (node) { node.addEventListener('click', closePicker); });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !picker.classList.contains('hidden')) closePicker(); });
            if (pickerSearch) {
                pickerSearch.addEventListener('input', function () {
                    var query = plain(pickerSearch.value);
                    options.forEach(function (row) {
                        if (row.hasAttribute('data-picker-all') && target && !holder(target).querySelector('option[value=""]')) return;
                        row.classList.toggle('hidden', !!query && plain(row.querySelector('[data-picker-name]').textContent).indexOf(query) === -1);
                    });
                });
            }
        }

        var current = page.querySelector('[data-index-type][aria-pressed="true"]');
        if (current) typeKey = current.getAttribute('data-index-type');
        show();
    });
})();

/**
 * قوايم الكروت في الموقع كله (مشاريع المنطقة / مشاريع المطور / مقالات المدونة):
 *
 * ديسك توب (1024px وأكبر) — أرقام الصفحات [data-pagination]:
 *   الضغط على رقم بيجيب الصفحة دي من السيرفر (نفس لينك ?page=N العادي) وبيبدّل الكروت وأرقام الصفحات مكانهم،
 *   من غير ما الصفحة كلها تتحمّل ولا ترجع لفوق. اللينك في المتصفح بيتغير (pushState) وزرار الرجوع شغال.
 *   لو التحميل فشل، اللينك بيفتح عادي.
 *   حدث shary:page ({ url, replace(nodes, paginationHtml, nextUrl) }): امنعوه (preventDefault) لو هتجيبوا الكروت بطريقتكم ونادوا replace.
 *
 * موبايل وتابلت — من غير "عرض المزيد": القايمة اللي عليها data-auto-more="3" بتكمّل لوحدها وأنت نازل:
 *   الأول بتظهر الكروت المتحمّلة والمخفية على الموبايل (class="hidden lg:block") 3 بـ 3،
 *   وبعدها بتطلب الصفحة اللي بعدها (data-next-url اللي على [data-pagination]) وتضيف كروتها تحت.
 *   حدث shary:load-more ({ url, append(nodes, nextUrl) }): امنعوه لو هتجيبوا الكروت بطريقتكم ونادوا append.
 *   العنصر [data-auto-sentinel] تحت القايمة: data-state="idle | loading | done".
 *
 * (شريط الإعلانات [data-ad-strip] بقى في js/shary/site-chrome.js عشان يشتغل في كل الصفحات.)
 *
 * السيرفر مش محتاج endpoint جديد: نفس الصفحة بـ ?page=N، والسكربت بياخد منها القايمة وأرقام الصفحات.
 */
(function () {
    if (!window.fetch || !window.DOMParser) return;

    var GRID = '[data-projects-grid], [data-articles-grid], [data-results]';
    var desktop = window.matchMedia('(min-width: 1024px)');

    function usable(url) { return !!url && url.charAt(0) !== '#'; }

    // القايمة اللي تبع أرقام الصفحات دي: أقرب عنصر فوقها جواه قايمة كروت
    function gridOf(nav) {
        var box = nav.parentNode;
        while (box && box.querySelector) {
            var grid = box.querySelector(GRID);
            if (grid) return grid;
            box = box.parentNode;
        }
        return null;
    }

    function navs(doc) { return Array.prototype.slice.call(doc.querySelectorAll('[data-pagination]')); }

    function load(url) {
        return fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (response) { if (!response.ok) throw new Error(response.status); return response.text(); })
            .then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
    }

    function copies(grid) {
        return Array.prototype.map.call(grid ? grid.children : [], function (node) { return document.importNode(node, true); });
    }

    // بعد تبديل الكروت: لو أول القايمة فوق الشاشة ننزّلها بهدوء لأول كارت — من غير ما نرجع لأول الصفحة
    function settle(grid) {
        var top = grid.getBoundingClientRect().top;
        if (top < 96) window.scrollTo({ top: window.pageYOffset + top - 120, behavior: 'smooth' });
    }

    // ---------- ديسك توب: تبديل الكروت مكانها ----------
    function swap(nav, url, push) {
        var grid = gridOf(nav);
        if (!grid || grid.__busy) return;
        var index = navs(document).indexOf(nav);
        grid.__busy = true;
        grid.classList.add('listing-loading');

        var detail = {
            url: url,
            replace: function (nodes, paginationHtml, nextUrl) {
                grid.textContent = '';
                Array.prototype.slice.call(nodes || []).forEach(function (node) { grid.appendChild(node); });
                if (typeof paginationHtml === 'string') nav.innerHTML = paginationHtml;
                nav.setAttribute('data-next-url', nextUrl || '');
                if (window.SharyCards) window.SharyCards.refresh(grid);
                grid.__busy = false;
                grid.classList.remove('listing-loading');
                if (push) history.pushState({ sharyListing: true }, '', url);
                settle(grid);
            }
        };
        if (!nav.dispatchEvent(new CustomEvent('shary:page', { bubbles: true, cancelable: true, detail: detail }))) return;

        load(url)
            .then(function (page) {
                var nextNav = navs(page)[index];
                var nextGrid = nextNav ? gridOf(nextNav) : null;
                if (!nextGrid) throw new Error('no list');
                detail.replace(copies(nextGrid), nextNav.innerHTML, nextNav.getAttribute('data-next-url'));
            })
            .catch(function () { window.location.href = url; });
    }

    document.addEventListener('click', function (event) {
        var link = event.target.closest ? event.target.closest('[data-pagination] a[href]') : null;
        if (!link || event.defaultPrevented || !desktop.matches) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;   // فتح في تاب جديد يفضل عادي
        var url = link.getAttribute('href');
        if (!usable(url)) return;
        event.preventDefault();
        swap(link.closest('[data-pagination]'), link.href, true);
    });

    // زرار الرجوع في المتصفح بعد تبديل الصفحات
    window.addEventListener('popstate', function () {
        var nav = navs(document)[0];
        if (nav && desktop.matches && (history.state && history.state.sharyListing || nav.__turned)) swap(nav, window.location.href, false);
    });
    document.addEventListener('shary:page', function (event) { event.target.__turned = true; });

    // ---------- موبايل: القايمة بتكمّل لوحدها ----------
    document.querySelectorAll('[data-auto-more]').forEach(function (grid) {
        var step = parseInt(grid.getAttribute('data-auto-more'), 10) || 3;
        var box = grid.parentNode;
        var sentinel = box.querySelector('[data-auto-sentinel]');
        if (!sentinel) return;
        var gridIndex = Array.prototype.indexOf.call(document.querySelectorAll('[data-auto-more]'), grid);
        var busy = false;
        var observer = null;

        function state(name) { sentinel.setAttribute('data-state', name); }
        function waiting() { return Array.prototype.slice.call(grid.querySelectorAll(':scope > .hidden.lg\\:block')); }
        function nextUrl() { var nav = box.querySelector('[data-pagination]'); return nav ? nav.getAttribute('data-next-url') || '' : ''; }

        function finish() {
            state('done');
            sentinel.classList.add('hidden');
            if (observer) { observer.disconnect(); observer = null; }
        }

        function near() {
            var rect = sentinel.getBoundingClientRect();
            return rect.width + rect.height > 0 && rect.top < window.innerHeight + 300;
        }

        function again() {
            busy = false;
            if (!waiting().length && !usable(nextUrl())) { finish(); return; }
            state('idle');
            setTimeout(function () { if (near()) more(); }, 80);
        }

        function more() {
            if (busy || desktop.matches) return;
            var hidden = waiting();
            if (hidden.length) {
                busy = true;
                state('loading');
                setTimeout(function () {
                    hidden.slice(0, step).forEach(function (card) { card.classList.remove('hidden', 'lg:block'); });
                    again();
                }, 350);
                return;
            }
            var url = nextUrl();
            if (!usable(url)) { finish(); return; }
            busy = true;
            state('loading');
            var detail = {
                url: url,
                append: function (nodes, next) {
                    Array.prototype.slice.call(nodes || []).forEach(function (node) {
                        node.classList.remove('hidden', 'lg:block');
                        grid.appendChild(node);
                    });
                    var nav = box.querySelector('[data-pagination]');
                    if (nav) nav.setAttribute('data-next-url', next || '');
                    if (window.SharyCards) window.SharyCards.refresh(grid);
                    again();
                }
            };
            if (!grid.dispatchEvent(new CustomEvent('shary:load-more', { bubbles: true, cancelable: true, detail: detail }))) return;
            load(url)
                .then(function (page) {
                    var incoming = page.querySelectorAll('[data-auto-more]')[gridIndex];
                    var nav = incoming ? incoming.parentNode.querySelector('[data-pagination]') : null;
                    detail.append(copies(incoming), nav ? nav.getAttribute('data-next-url') : '');
                })
                .catch(function () { busy = false; finish(); });
        }

        if (!waiting().length && !usable(nextUrl())) { finish(); return; }
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) more(); }, { rootMargin: '300px 0px' });
            observer.observe(sentinel);
        } else {
            window.addEventListener('scroll', function () { if (near()) more(); });
        }
    });
})();

/**
 * صفحة وحدة الإيجار (rent/show.blade.php):
 * - المعرض [data-rent-gallery]: الضغط على صورة [data-gallery-item] بيخليها الصورة المفتوحة (data-active="1").
 *   لو الصورة مفتوحة بالفعل بيتفتح عارض الصور عليها.
 * - عارض الصور [data-rent-lightbox]: أي زرار [data-lightbox-open="gallery | floor | master"] بيفتحه على صور المجموعة دي
 *   (الصور اللي عليها data-lightbox-item بنفس الاسم). بنفس شكل تطبيق شاري: X + عدّاد "1 / 5"، وصف صور صغيرة تحت للمعرض،
 *   ومخطط الوحدة جوه كارت أبيض. السحب / الأسهم / الكيبورد بتقلّب، و X أو الضغط بره أو Esc بيقفل.
 */
(function () {
    document.querySelectorAll('[data-rent-lightbox]').forEach(function (box) {
        var scope = box.closest('main') || document;
        var view = box.querySelector('[data-lightbox-image]');
        var counter = box.querySelector('[data-lightbox-count]');
        var thumbs = box.querySelector('[data-lightbox-thumbs]');
        var arrows = box.querySelectorAll('[data-lightbox-prev], [data-lightbox-next]');
        var items = [];
        var at = 0;
        var opener = null;

        function show(index) {
            if (!items.length) return;
            at = (index + items.length) % items.length;
            var source = items[at];
            view.src = source.currentSrc || source.getAttribute('src');
            view.alt = source.getAttribute('alt') || '';
            counter.textContent = (at + 1) + ' / ' + items.length;
            Array.prototype.forEach.call(thumbs.children, function (thumb, i) { thumb.setAttribute('aria-current', i === at ? 'true' : 'false'); });
            var current = thumbs.children[at];
            if (current && current.scrollIntoView) current.scrollIntoView({ block: 'nearest', inline: 'center' });
        }

        // group: gallery = صور الوحدة (صف صور صغيرة تحت) ، floor = مخطط الوحدة (جوه كارت أبيض) ، master = المخطط العام
        function open(group, index, from) {
            items = Array.prototype.slice.call(scope.querySelectorAll('[data-lightbox-item="' + group + '"]'));
            if (!items.length) return;
            opener = from || null;
            box.setAttribute('data-group', group);
            thumbs.textContent = '';
            if (group === 'gallery' && items.length > 1) {
                items.forEach(function (source, i) {
                    var thumb = document.createElement('button');
                    thumb.type = 'button';
                    var image = document.createElement('img');
                    image.src = source.currentSrc || source.getAttribute('src');
                    image.alt = '';
                    thumb.appendChild(image);
                    thumb.addEventListener('click', function () { show(i); });
                    thumbs.appendChild(thumb);
                });
            }
            thumbs.classList.toggle('hidden', !thumbs.children.length);
            counter.classList.toggle('hidden', group === 'floor');
            arrows.forEach(function (button) { button.classList.toggle('lg:flex', items.length > 1); });
            show(index || 0);
            box.classList.remove('hidden');
            document.documentElement.style.overflow = 'hidden';
        }

        function close() {
            box.classList.add('hidden');
            document.documentElement.style.overflow = '';
            if (opener) opener.focus();
        }

        scope.querySelectorAll('[data-lightbox-open]').forEach(function (button) {
            button.addEventListener('click', function () { open(button.getAttribute('data-lightbox-open'), 0, button); });
        });
        box.querySelectorAll('[data-lightbox-close]').forEach(function (button) { button.addEventListener('click', close); });
        box.querySelector('[data-lightbox-prev]').addEventListener('click', function () { show(at - 1); });
        box.querySelector('[data-lightbox-next]').addEventListener('click', function () { show(at + 1); });
        // السحب بالصباع يمين / شمال بيقلّب الصور
        var startX = null;
        box.addEventListener('touchstart', function (event) { startX = event.touches[0].clientX; }, { passive: true });
        box.addEventListener('touchend', function (event) {
            if (startX === null) return;
            var moved = event.changedTouches[0].clientX - startX;
            startX = null;
            if (Math.abs(moved) < 45 || items.length < 2) return;
            var rtl = !!box.closest('[dir="rtl"]');
            show(at + ((moved < 0) === rtl ? -1 : 1));
        });
        document.addEventListener('keydown', function (event) {
            if (box.classList.contains('hidden')) return;
            var rtl = !!box.closest('[dir="rtl"]');
            if (event.key === 'Escape') close();
            else if (event.key === 'ArrowLeft') show(at + (rtl ? 1 : -1));
            else if (event.key === 'ArrowRight') show(at + (rtl ? -1 : 1));
        });

        // المعرض: الصورة المضغوطة بتبقى المفتوحة، ولو مفتوحة بالفعل بيتفتح العارض عليها
        scope.querySelectorAll('[data-rent-gallery]').forEach(function (root) {
            var tiles = Array.prototype.slice.call(root.querySelectorAll('[data-gallery-item]'));
            tiles.forEach(function (tile, index) {
                tile.addEventListener('click', function () {
                    if (tile.getAttribute('data-active') === '1') { open('gallery', index, tile); return; }
                    tiles.forEach(function (other) { other.setAttribute('data-active', other === tile ? '1' : '0'); });
                });
            });
        });
    });
})();

/**
 * صفحة الوحدة (units/show.blade.php) وصفحة المشروع (projects/show.blade.php):
 *
 * - مؤشرات الاستثمار [data-insights] (property/partials/insights.blade.php):
 *   البيانات في <script type="application/json" data-insight-data> بنفس شكل $insights.
 *   التبويب [data-insight-tab="unfinished | finished"] بيبدّل الرسم وأرقام الإيجار وإعادة البيع
 *   ([data-insight="monthly | yield | after | profit"]) من غير تحميل.
 *   الرسم [data-insight-chart] (زي التطبيق): خطين ناعمين (بعد الاستلام / سعر السوق)، وعلى كل خط سنة معلّمة بعمود ملوّن وقيمتها بالمليون:
 *   sets[..].delivery = سنة الاستلام على خط "بعد الاستلام" ، sets[..].market_mark = السنة المعلّمة على خط "سعر السوق" (اختياري).
 *   الماوس أو الصباع على الرسم بيظهر أرقام السنة.
 *   الجدول [data-insight-table] (sr-only) بيتحدّث مع التبويب لقارئ الشاشة.
 *   لو البيانات اتغيرت بعد التحميل: window.SharyProperty.refresh(root) بيعيد قراية البيانات ويرسم من جديد.
 *
 * - شريط الملخص [data-prop-bar] (property/partials/summary-bar.blade.php): بيفضل ثابت تحت الهيدر وأنت نازل.
 *   ديسك توب: الشريط كله. موبايل: سطر السعر (.prop-bar__prices) بس — السكربت بيحسب المكان من ارتفاع الهيدر. وهو ثابت بياخد class="is-stuck".
 *
 * - المعرض [data-gallery-slider] (partials/photo-gallery.blade.php مع slider): على الموبايل صورة واحدة بتتسحب بالجنب وتحتها نقط.
 *   الصور بتتقلّب لوحدها كل 4.5 ثانية (موبايل وديسك توب)، وبتقف وقت ما العميل ماسكها أو عارض الصور مفتوح.
 *
 * - وحدات المشروع [data-project-units] (data-per-page = عدد الكروت في الصفحة على الديسك توب):
 *   كل كروت المشروع [data-unit] موجودة في [data-project-grid]، وعلى كل كارت: data-sale ، data-invest ، data-types ، data-beds ، data-baths ، data-size ،
 *   data-finishing ، data-delivery ، data-years ، data-price ، data-installment ، data-order.
 *   التبويب [data-unit-tab=" | developer | resale | invest"] بيظهر كروت النوع ده بس.
 *   "تصفية" والترتيب: نفس فورم فلاتر الموقع (areas/partials/filters.blade.php مع projectFilters) — صفحة الفلاتر بتفتح من js/shary/area-page.js،
 *   و"عرض النتائج" بيفلتر كروت الصفحة هنا من غير تحميل (type[] ، bedrooms[] ، bathrooms[] ، finishing[] ، delivery[] ، years[] ، السعر ، المساحة ، sort).
 *   ديسك توب: أرقام الصفحات [data-units-pages] بتبدّل الكروت مكانها (من غير تحميل ولا رجوع لأول الصفحة).
 *   موبايل: 3 كروت والباقي بيكمّل لوحده وأنت نازل ([data-units-sentinel]) — من غير "عرض المزيد".
 *   حدث shary:project-units ({ tab, sort, filters, url }) قبل التبديل: امنعوه (preventDefault) لو هتجيبوا الكروت من السيرفر بطريقتكم،
 *   وبعد ما تحطوا الكروت الجديدة في [data-project-grid] نادوا section.__renderUnits().
 */
(function () {
    var UNIT_COLOR = '#2A9D8F';     // بعد الاستلام
    var MARKET_COLOR = '#E9A23B';   // سعر السوق
    var INK = '#123A5C';
    var MUTED = '#5B6B7C';
    var GRID = '#E4E9EF';
    var NS = 'http://www.w3.org/2000/svg';

    function el(name, attrs, parent) {
        var node = document.createElementNS(NS, name);
        Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
        if (parent) parent.appendChild(node);
        return node;
    }

    function money(value) {
        return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function millions(value) {
        return (Math.round(value / 100000) / 10).toFixed(1);
    }

    // أرقام محور السعر: 4 خطوط بفرق "مريح" (0.5 / 1 / 2 / 5 مليون ...)
    function ticks(min, max) {
        var span = Math.max(max - min, 1);
        var raw = span / 4;
        var pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
        var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * pow; }).filter(function (s) { return s >= raw; })[0];
        var from = Math.floor(min / step) * step;
        var out = [];
        for (var v = from; v < max + step; v += step) out.push(v);
        return out;
    }

    // خط ناعم بيعدّي على كل النقط من غير ما يطلع أو ينزل عن قيمها (monotone cubic)
    function smooth(points) {
        var n = points.length;
        if (n < 3) return points.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
        var slopes = [], tangents = [], i;
        for (i = 0; i < n - 1; i++) slopes.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
        tangents.push(slopes[0]);
        for (i = 1; i < n - 1; i++) tangents.push(slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2);
        tangents.push(slopes[n - 2]);
        for (i = 0; i < n - 1; i++) {
            if (slopes[i] === 0) { tangents[i] = 0; tangents[i + 1] = 0; continue; }
            var a = tangents[i] / slopes[i], b = tangents[i + 1] / slopes[i], h = a * a + b * b;
            if (h > 9) { var t = 3 / Math.sqrt(h); tangents[i] = t * a * slopes[i]; tangents[i + 1] = t * b * slopes[i]; }
        }
        var d = 'M' + points[0][0].toFixed(1) + ' ' + points[0][1].toFixed(1);
        for (i = 0; i < n - 1; i++) {
            var dx = (points[i + 1][0] - points[i][0]) / 3;
            d += ' C' + (points[i][0] + dx).toFixed(1) + ' ' + (points[i][1] + tangents[i] * dx).toFixed(1) + ' ' +
                (points[i + 1][0] - dx).toFixed(1) + ' ' + (points[i + 1][1] - tangents[i + 1] * dx).toFixed(1) + ' ' +
                points[i + 1][0].toFixed(1) + ' ' + points[i + 1][1].toFixed(1);
        }
        return d;
    }

    function draw(section) {
        var state = section.__insights;
        var box = section.querySelector('[data-insight-chart]');
        if (!state || !box) return;
        var set = state.data.sets[state.tab];
        var years = state.data.years;
        if (!set || !years || !years.length) return;
        var width = Math.round(box.clientWidth);
        if (!width) return;   // الصفحة مخفية دلوقتي — هيترسم أول ما تظهر
        var height = width < 480 ? 230 : 280;
        var pad = { top: 34, right: 18, bottom: 32, left: 34 };
        var all = set.unit.concat(set.market);
        var scale = ticks(Math.min.apply(null, all), Math.max.apply(null, all));
        var low = scale[0], high = scale[scale.length - 1];
        var plotW = width - pad.left - pad.right;
        var plotH = height - pad.top - pad.bottom;
        var floor = height - pad.bottom;
        var last = years.length - 1;
        function x(i) { return pad.left + (last > 0 ? plotW * i / last : plotW / 2); }
        function y(v) { return pad.top + plotH * (1 - (v - low) / (high - low)); }
        function line(values) { return smooth(values.map(function (v, i) { return [x(i), y(v)]; })); }
        function clamp(i) { return Math.max(0, Math.min(last, i)); }

        box.textContent = '';
        var svg = el('svg', { viewBox: '0 0 ' + width + ' ' + height, width: width, height: height, role: 'img', 'aria-label': box.getAttribute('data-alt') || '' }, box);
        var defs = el('defs', {}, svg);
        function gradient(name, color, from, to) {
            var id = 'prop-' + name + '-' + state.id;
            var grad = el('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
            el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': from }, grad);
            el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': to }, grad);
            return 'url(#' + id + ')';
        }
        var areaFill = gradient('area', UNIT_COLOR, 0.16, 0);
        var unitBar = gradient('unit', UNIT_COLOR, 0.08, 0.6);
        var marketBar = gradient('market', MARKET_COLOR, 0.08, 0.6);

        // السنة المعلّمة على كل خط: الاستلام على خط "بعد الاستلام" ، و market_mark على خط "سعر السوق"
        var d = clamp(set.delivery);
        var marks = [{ at: d, value: set.unit[d], color: UNIT_COLOR, bar: unitBar, ink: '#1F7F72' }];
        if (set.market_mark != null && clamp(set.market_mark) !== d) {
            var m = clamp(set.market_mark);
            marks.unshift({ at: m, value: set.market[m], color: MARKET_COLOR, bar: marketBar, ink: '#B7770D' });
        }

        // خطوط المحور وأرقامه (مليون)
        scale.forEach(function (v) {
            el('line', { x1: pad.left, x2: width - pad.right, y1: y(v), y2: y(v), stroke: GRID, 'stroke-width': 1 }, svg);
            var label = el('text', { x: pad.left - 8, y: y(v) + 4, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 600, fill: MUTED }, svg);
            label.textContent = millions(v).replace(/\.0$/, '');
        });

        // العمود الملوّن تحت كل نقطة معلّمة + مربع سنتها على المحور
        marks.forEach(function (mark) {
            el('rect', { x: x(mark.at) - 12, y: y(mark.value), width: 24, height: floor - y(mark.value), fill: mark.bar, rx: 3 }, svg);
            el('rect', { x: x(mark.at) - 17, y: floor + 5, width: 34, height: 19, rx: 5, fill: mark.color, opacity: 0.22 }, svg);
        });
        years.forEach(function (year, i) {
            var marked = marks.some(function (mark) { return mark.at === i; });
            var label = el('text', { x: x(i), y: floor + 18.5, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': marked ? 800 : 600, fill: marked ? INK : MUTED }, svg);
            label.textContent = !marked && width < 360 && i % 2 ? '' : year;
        });

        // المساحة تحت خط "بعد الاستلام" + الخطين
        el('path', { d: line(set.unit) + ' L' + x(last).toFixed(1) + ' ' + floor + ' L' + x(0).toFixed(1) + ' ' + floor + ' Z', fill: areaFill }, svg);
        el('path', { d: line(set.market), fill: 'none', stroke: MARKET_COLOR, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
        el('path', { d: line(set.unit), fill: 'none', stroke: UNIT_COLOR, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);

        // النقطة المعلّمة: خط رأسي + نقطة + القيمة بالمليون جنبها
        marks.forEach(function (mark) {
            var px = x(mark.at), py = y(mark.value);
            el('line', { x1: px, x2: px, y1: py, y2: floor, stroke: INK, 'stroke-width': 1.5 }, svg);
            el('circle', { cx: px, cy: py, r: 5, fill: INK, stroke: '#fff', 'stroke-width': 2 }, svg);
            var text = millions(mark.value);
            var w = text.length * 7.2 + 14;
            var left = px - 10 - w >= pad.left;   // القيمة على شمال النقطة، ولو مفيش مكان تبقى على يمينها
            var bx = left ? px - 10 - w : px + 10;
            var by = Math.max(4, py - 24);
            el('rect', { x: bx, y: by, width: w, height: 20, rx: 6, fill: '#fff', stroke: mark.color, 'stroke-width': 1 }, svg);
            var label = el('text', { x: bx + w / 2, y: by + 14, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: mark.ink }, svg);
            label.textContent = text;
        });
        // اسم علامة الاستلام فوق عمودها
        var caption = el('text', { x: x(d), y: 12, 'text-anchor': d === 0 ? 'start' : d === last ? 'end' : 'middle', 'font-size': 11, 'font-weight': 700, fill: MUTED }, svg);
        caption.textContent = box.getAttribute('data-label-delivery') || '';

        // الماوس / الصباع: خط رأسي + نقطتين + كارت فيه أرقام السنة
        var cross = el('line', { y1: pad.top - 6, y2: floor, stroke: INK, 'stroke-width': 1, opacity: 0 }, svg);
        var dotUnit = el('circle', { r: 5, fill: UNIT_COLOR, stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg);
        var dotMarket = el('circle', { r: 5, fill: MARKET_COLOR, stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg);
        var tip = document.createElement('div');
        tip.className = 'prop-chart__tip';
        tip.hidden = true;
        var page = box.parentNode.closest ? box.parentNode.closest('[dir]') : null;
        tip.setAttribute('dir', page ? page.getAttribute('dir') : 'ltr');
        box.appendChild(tip);
        var egp = box.getAttribute('data-label-egp') || '';

        function row(color, name, value) {
            var line = document.createElement('p');
            var key = document.createElement('i');
            key.style.backgroundColor = color;
            var text = document.createElement('span');
            text.textContent = name;
            var number = document.createElement('b');
            number.setAttribute('dir', 'ltr');
            number.textContent = money(value);
            var unit = document.createElement('small');
            unit.textContent = egp;
            line.appendChild(key); line.appendChild(text); line.appendChild(number); line.appendChild(unit);
            return line;
        }

        function show(i) {
            cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('opacity', 0.35);
            dotUnit.setAttribute('cx', x(i)); dotUnit.setAttribute('cy', y(set.unit[i])); dotUnit.setAttribute('opacity', 1);
            dotMarket.setAttribute('cx', x(i)); dotMarket.setAttribute('cy', y(set.market[i])); dotMarket.setAttribute('opacity', 1);
            tip.textContent = '';
            var head = document.createElement('strong');
            head.textContent = years[i] + (i === d ? ' · ' + (box.getAttribute('data-label-delivery') || '') : '');
            tip.appendChild(head);
            tip.appendChild(row(UNIT_COLOR, box.getAttribute('data-label-unit') || '', set.unit[i]));
            tip.appendChild(row(MARKET_COLOR, box.getAttribute('data-label-market') || '', set.market[i]));
            tip.hidden = false;
            var half = tip.offsetWidth / 2;
            tip.style.left = Math.max(half, Math.min(width - half, x(i))) + 'px';
            tip.style.top = Math.max(0, Math.min(y(set.unit[i]), y(set.market[i])) - tip.offsetHeight - 12) + 'px';
        }
        function hide() {
            cross.setAttribute('opacity', 0); dotUnit.setAttribute('opacity', 0); dotMarket.setAttribute('opacity', 0);
            tip.hidden = true;
        }
        function at(event) {
            var rect = svg.getBoundingClientRect();
            var point = event.touches ? event.touches[0] : event;
            var ratio = (point.clientX - rect.left - pad.left) / plotW;
            show(clamp(Math.round(ratio * last)));
        }
        svg.addEventListener('mousemove', at);
        svg.addEventListener('mouseleave', hide);
        svg.addEventListener('touchstart', at, { passive: true });
        svg.addEventListener('touchmove', at, { passive: true });
        svg.addEventListener('touchend', function () { setTimeout(hide, 1600); });
    }

    function fill(section) {
        var state = section.__insights;
        var set = state.data.sets[state.tab];
        if (!set) return;
        var values = { monthly: set.rental.monthly, yield: set.rental.yield, after: set.resale.after, profit: set.resale.profit };
        Object.keys(values).forEach(function (key) {
            var node = section.querySelector('[data-insight="' + key + '"]');
            if (node) node.textContent = values[key];
        });
        section.querySelectorAll('[data-insight-tab]').forEach(function (button) {
            button.setAttribute('aria-pressed', button.getAttribute('data-insight-tab') === state.tab ? 'true' : 'false');
        });
        var body = section.querySelector('[data-insight-table] tbody');
        if (body) {
            body.textContent = '';
            state.data.years.forEach(function (year, i) {
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                th.setAttribute('scope', 'row');
                th.textContent = year;
                tr.appendChild(th);
                [set.unit[i], set.market[i]].forEach(function (value) {
                    var td = document.createElement('td');
                    td.textContent = money(value);
                    tr.appendChild(td);
                });
                body.appendChild(tr);
            });
        }
        draw(section);
    }

    var counter = 0;
    function setup(section) {
        var source = section.querySelector('[data-insight-data]');
        if (!source) return;
        var data;
        try { data = JSON.parse(source.textContent); } catch (error) { return; }
        var first = !section.__insights;
        var tab = first ? (data.tabs && data.tabs[0] ? data.tabs[0].key : Object.keys(data.sets)[0]) : section.__insights.tab;
        section.__insights = { data: data, tab: tab, id: first ? ++counter : section.__insights.id };
        fill(section);
        if (!first) return;
        section.querySelectorAll('[data-insight-tab]').forEach(function (button) {
            button.addEventListener('click', function () {
                section.__insights.tab = button.getAttribute('data-insight-tab');
                fill(section);
            });
        });
        // الرسم بيتظبط على عرض مكانه: بيترسم تاني لو العرض اتغير (تدوير الموبايل / تكبير الشاشة / الصفحة ظهرت بعد ما كانت مخفية)
        var box = section.querySelector('[data-insight-chart]');
        var seen = box ? box.clientWidth : 0;
        function again() {
            if (!box || box.clientWidth === seen) return;
            seen = box.clientWidth;
            draw(section);
        }
        if (window.ResizeObserver && box) new ResizeObserver(again).observe(box);
        else window.addEventListener('resize', again);
    }

    function refresh(root) {
        (root || document).querySelectorAll('[data-insights]').forEach(setup);
    }
    window.SharyProperty = { refresh: refresh };
    refresh(document);

    // ---------- شريط الملخص [data-prop-bar]: بيفضل ثابت تحت الهيدر وأنت نازل ----------
    // ديسك توب: الشريط كله ثابت. موبايل: سطر العنوان بيطلع مع الصفحة وسطر السعر هو اللي بيفضل ثابت تحت الهيدر.
    document.querySelectorAll('[data-prop-bar]').forEach(function (bar) {
        var prices = bar.querySelector('.prop-bar__prices');
        var scope = bar.closest('[lang]') || document;
        var wide = window.matchMedia('(min-width: 1024px)');
        var top = null;
        function place() {
            if (!bar.offsetHeight) return;   // الصفحة مخفية دلوقتي
            var header = scope.querySelector('header');
            var base = header ? (parseFloat(window.getComputedStyle(header).top) || 0) + header.offsetHeight : 0;
            var shift = wide.matches || !prices ? 0 : prices.getBoundingClientRect().top - bar.getBoundingClientRect().top - 10;
            top = Math.round(base - shift);
            bar.style.top = top + 'px';
            stuck();
        }
        function stuck() {
            if (top === null) return;
            bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= top + 1 && window.pageYOffset > 0);
        }
        var waiting = false;
        window.addEventListener('scroll', function () {
            if (waiting) return;
            waiting = true;
            // مكان الشريط بيتحسب تاني مع السكرول: لو ارتفاع أو مكان الهيدر اتغير بعد التحميل (شريط فوقه، خط اتحمّل) الشريط ما يتغطاش بالهيدر
            window.requestAnimationFrame(function () { waiting = false; place(); });
        }, { passive: true });
        window.addEventListener('resize', place);
        if (window.ResizeObserver) new ResizeObserver(place).observe(bar);
        place();
    });

    // ---------- المعرض على الموبايل [data-gallery-slider]: صورة في النص بالألوان بتتسحب بالجنب (وطرف اللي جنبها أبيض وأسود) وتحتها نقط ----------
    // الصورة اللي قدام العميل بتبقى هي المفتوحة (data-active="1")، فالضغط عليها بيفتح عارض الصور على طول
    var narrow = window.matchMedia('(max-width: 1023px)');
    document.querySelectorAll('[data-gallery-slider]').forEach(function (track) {
        var slides = Array.prototype.slice.call(track.querySelectorAll('[data-gallery-item]'));
        var holder = track.parentNode.querySelector('[data-gallery-dots]');
        if (slides.length < 2 || !holder) return;
        var dots = slides.map(function () { return holder.appendChild(document.createElement('i')); });
        // thumbs (وحدة البيع على الموبايل): صورة كبيرة وتحتها صور صغيرة — مفيش سحب، الصورة المفتوحة بتتبدّل مكانها زي الديسك توب
        var thumbs = track.classList.contains('rent-gallery--thumbs');
        function mark() {
            if (!narrow.matches || thumbs || !track.offsetWidth) return;
            var box = track.getBoundingClientRect();
            var middle = box.left + box.width / 2;
            var best = 0, gap = Infinity;
            // الصورة اللي في نص المعرض هي المفتوحة (بالألوان) — اللي جنبها أبيض وأسود
            slides.forEach(function (slide, i) {
                var r = slide.getBoundingClientRect();
                var d = Math.abs(r.left + r.width / 2 - middle);
                if (d < gap) { gap = d; best = i; }
            });
            slides.forEach(function (slide, i) { slide.setAttribute('data-active', i === best ? '1' : '0'); });
            dots.forEach(function (dot, i) { dot.setAttribute('aria-current', i === best ? 'true' : 'false'); });
        }
        var waiting = false;
        track.addEventListener('scroll', function () {
            if (waiting) return;
            waiting = true;
            window.requestAnimationFrame(function () { waiting = false; mark(); });
        }, { passive: true });
        dots[0].setAttribute('aria-current', 'true');
        mark();

        // الصور بتتقلّب لوحدها بالراحة، واحدة واحدة (كل 4.5 ثانية): موبايل بتتسحب للصورة اللي بعدها — ديسك توب الشريحة اللي بعدها هي اللي بتتفتح.
        // بتقف طول ما العميل ماسكها أو واقف عليها بالماوس، ولو عارض الصور مفتوح، ولو المعرض مش ظاهر على الشاشة، ولو الجهاز مطفّي الحركة.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var wrap = track.parentNode;
        var held = false, seen = true, resume = null;
        function hold() { held = true; if (resume) { clearTimeout(resume); resume = null; } }
        function release(wait) { if (resume) clearTimeout(resume); resume = setTimeout(function () { held = false; resume = null; }, wait); }
        wrap.addEventListener('mouseenter', hold);
        wrap.addEventListener('mouseleave', function () { release(0); });
        wrap.addEventListener('touchstart', hold, { passive: true });
        wrap.addEventListener('touchend', function () { release(5000); }, { passive: true });
        wrap.addEventListener('focusin', hold);
        wrap.addEventListener('focusout', function () { release(0); });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { seen = entries[0].isIntersecting; }, { threshold: 0.5 }).observe(wrap);
        }
        window.setInterval(function () {
            if (held || !seen || document.hidden || !track.offsetWidth) return;
            if (document.querySelector('[data-rent-lightbox]:not(.hidden)')) return;
            var at = 0;
            slides.forEach(function (slide, i) { if (slide.getAttribute('data-active') === '1') at = i; });
            var next = (at + 1) % slides.length;
            if (narrow.matches && !thumbs) {
                var to = slides[next].getBoundingClientRect(), frame = track.getBoundingClientRect();
                var left = track.scrollLeft + (to.left + to.width / 2) - (frame.left + frame.width / 2);
                track.scrollTo({ left: left, behavior: 'smooth' });
            } else {
                slides.forEach(function (slide, i) { slide.setAttribute('data-active', i === next ? '1' : '0'); });
            }
        }, 4500);
    });

    // ---------- متابعة المشروع [data-follow-toggle]: "متابعة" ⇄ "متابَع". بتتحفظ على جهاز العميل (localStorage: shary:follows).
    // حدث shary:follow ({ id, following }) على الزرار: اسمعوه عشان تحفظوا المتابعة على حساب العميل، أو امنعوه (preventDefault) لو محتاجين تسجيل دخول الأول.
    document.querySelectorAll('[data-follow-toggle]').forEach(function (button) {
        var label = button.querySelector('[data-label]');
        function saved() { try { return JSON.parse(window.localStorage.getItem('shary:follows') || '[]'); } catch (e) { return []; } }
        function paint(on) {
            button.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (label) label.textContent = button.getAttribute(on ? 'data-on' : 'data-off');
        }
        paint(saved().indexOf(button.getAttribute('data-follow-id')) > -1);
        button.addEventListener('click', function () {
            var id = button.getAttribute('data-follow-id');
            var on = button.getAttribute('aria-pressed') !== 'true';
            var event = new CustomEvent('shary:follow', { bubbles: true, cancelable: true, detail: { id: id, following: on } });
            if (!button.dispatchEvent(event)) return;
            var list = saved().filter(function (item) { return item !== id; });
            if (on) list.push(id);
            try { window.localStorage.setItem('shary:follows', JSON.stringify(list)); } catch (e) {}
            paint(on);
        });
    });

    // ---------- زرار "الخريطة" على الديسك توب [data-map-open]: بيفتح خريطة المشروع على الشاشة كلها (نفس زرار التكبير في js/shary/area-page.js) ----------
    document.querySelectorAll('[data-map-open]').forEach(function (button) {
        button.addEventListener('click', function () {
            var expand = document.querySelector('.prop-map [data-map-expand]');
            if (expand) expand.click();
        });
    });

    // ---------- خطط الدفع في المشروع [data-plan-list]: "عرض كل الخطط" بيفرد باقي الخطط على الموبايل ويقفلها ----------
    document.querySelectorAll('[data-plan-list]').forEach(function (list) {
        var toggle = list.querySelector('[data-plan-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var open = toggle.getAttribute('aria-expanded') !== 'true';
            list.querySelectorAll('[data-plan-extra]').forEach(function (item) { item.classList.toggle('hidden', !open); item.classList.toggle('flex', open); });
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.querySelector('[data-label]').textContent = toggle.getAttribute(open ? 'data-less' : 'data-more');
            toggle.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
        });
    });

    // ---------- وحدات المشروع: التبويب + الترتيب + الصفحات ----------
    var desktop = window.matchMedia('(min-width: 1024px)');
    document.querySelectorAll('[data-project-units]').forEach(function (section) {
        var grid = section.querySelector('[data-project-grid]');
        if (!grid) return;
        var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-unit-tab]'));
        var form = section.querySelector('form[data-area-filters]');   // فورم الفلاتر والترتيب (areas/partials/filters.blade.php)
        var count = section.querySelector('[data-units-count]');
        var empty = section.querySelector('[data-units-empty]');
        var pages = section.querySelector('[data-units-pages]');
        var sentinel = section.querySelector('[data-units-sentinel]');
        var perPage = parseInt(section.getAttribute('data-per-page'), 10) || 9;
        var STEP = 3;          // موبايل: 3 كروت في كل مرة
        var page = 1;
        var shown = STEP;
        var busy = false;

        function current(list, name) {
            var on = list.filter(function (item) { return item.getAttribute('aria-current') === 'true'; })[0];
            return on ? on.getAttribute(name) : '';
        }
        function number(card, name) { return parseFloat(card.getAttribute(name)) || 0; }

        // اختيارات فورم الفلاتر: type[] ، bedrooms[] ، bathrooms[] ، finishing[] ، delivery[] ، years[] ، السعر والمساحة (من – إلى) ، sort
        function picked(name) {
            return form ? Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '[]"]:checked'), function (box) { return box.value; }) : [];
        }
        function field(selector) {
            var input = form ? form.querySelector(selector) : null;
            return input && input.value !== '' ? Number(String(input.value).replace(/,/g, '')) : null;
        }
        function sortValue() {
            var radio = form ? form.querySelector('input[name="sort"]:checked') : null;
            return radio ? radio.value : '';
        }

        // الكروت اللي تبع التبويب المفتوح والفلاتر المختارة، مترتبة بالترتيب المختار
        function matching() {
            var tab = current(tabs, 'data-unit-tab');
            var sort = sortValue();
            var types = picked('type'), beds = picked('bedrooms'), baths = picked('bathrooms'), finishing = picked('finishing'), delivery = picked('delivery'), years = picked('years');
            var priceLow = field('[data-range-min="price"]'), priceHigh = field('[data-range-max="price"]');
            var sizeLow = field('[data-range-min="size"]'), sizeHigh = field('[data-range-max="size"]');
            function has(list, value) { return !list.length || list.indexOf(String(value)) > -1; }
            function deliveryYear(card) { return card.getAttribute('data-delivery') === 'ready' ? 0 : number(card, 'data-delivery'); }
            var by = {
                price_asc: function (a, b) { return number(a, 'data-price') - number(b, 'data-price'); },
                price_desc: function (a, b) { return number(b, 'data-price') - number(a, 'data-price'); },
                installment_asc: function (a, b) { return number(a, 'data-installment') - number(b, 'data-installment'); },
                installment_desc: function (a, b) { return number(b, 'data-installment') - number(a, 'data-installment'); },
                delivery: function (a, b) { return deliveryYear(a) - deliveryYear(b); }
            }[sort] || function () { return 0; };
            return Array.prototype.slice.call(grid.querySelectorAll(':scope > [data-unit]'))
                .filter(function (card) {
                    var price = number(card, 'data-price'), size = number(card, 'data-size'), y = number(card, 'data-years');
                    return (!tab || (tab === 'invest' ? card.getAttribute('data-invest') === '1' : card.getAttribute('data-sale') === tab)) &&
                        has(types, card.getAttribute('data-types')) && has(beds, card.getAttribute('data-beds')) && has(baths, card.getAttribute('data-baths')) &&
                        has(finishing, card.getAttribute('data-finishing')) && has(delivery, card.getAttribute('data-delivery')) &&
                        (!years.length || years.indexOf(y >= 9 ? '9+' : String(y)) > -1) &&
                        (priceLow === null || price >= priceLow) && (priceHigh === null || price <= priceHigh) &&
                        (sizeLow === null || size >= sizeLow) && (sizeHigh === null || size <= sizeHigh);
                })
                .sort(function (a, b) { return by(a, b) || number(a, 'data-order') - number(b, 'data-order'); });
        }

        function arrow(next) {
            return '<svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="' + (next ? 'M6.75 4.5L11.25 9L6.75 13.5' : 'M11.25 4.5L6.75 9L11.25 13.5') + '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }
        function pageButton(label, target, options) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'prop-page';
            if (options.html) button.innerHTML = options.html; else button.textContent = label;
            if (options.title) button.setAttribute('aria-label', options.title);
            if (options.current) button.setAttribute('aria-current', 'page');
            if (options.disabled) button.disabled = true;
            else button.addEventListener('click', function () { turn(target); });
            pages.appendChild(button);
        }

        function render() {
            var list = matching();
            var total = Math.max(1, Math.ceil(list.length / perPage));
            page = Math.min(page, total);
            var visible = desktop.matches ? list.slice((page - 1) * perPage, page * perPage) : list.slice(0, shown);
            Array.prototype.forEach.call(grid.querySelectorAll(':scope > [data-unit]'), function (card) {
                card.classList.remove('lg:block');
                card.classList.add('hidden');
            });
            list.forEach(function (card) { grid.appendChild(card); });
            visible.forEach(function (card) { card.classList.remove('hidden'); });
            if (count) count.textContent = list.length;
            if (empty) empty.classList.toggle('hidden', list.length > 0);
            if (pages) {
                pages.textContent = '';
                if (total > 1) {
                    pageButton('', page - 1, { html: arrow(false), title: pages.getAttribute('data-prev'), disabled: page === 1 });
                    for (var n = 1; n <= total; n++) pageButton(n, n, { current: n === page, title: (pages.getAttribute('data-page') || '').replace(':n', n) });
                    pageButton('', page + 1, { html: arrow(true), title: pages.getAttribute('data-next'), disabled: page === total });
                }
            }
            if (sentinel) {
                var more = !desktop.matches && shown < list.length;
                sentinel.classList.toggle('hidden', !more);
                sentinel.setAttribute('data-state', more ? 'idle' : 'done');
            }
        }

        // ديسك توب: رقم الصفحة بيبدّل الكروت مكانها، ولو أول القسم فوق الشاشة بننزّله بهدوء لأول كارت
        function turn(target) {
            page = target;
            render();
            var bar = document.querySelector('[data-prop-bar]');
            var offset = (bar ? bar.getBoundingClientRect().bottom : 96) + 16;
            var top = section.getBoundingClientRect().top;
            if (top < offset) window.scrollTo({ top: window.pageYOffset + top - offset, behavior: 'smooth' });
        }

        // موبايل: الوحدات بتكمّل لوحدها وأنت نازل
        function more() {
            if (busy || desktop.matches || shown >= matching().length) return;
            busy = true;
            if (sentinel) sentinel.setAttribute('data-state', 'loading');
            setTimeout(function () {
                shown += STEP;
                busy = false;
                render();
                if (sentinel && !sentinel.classList.contains('hidden') && sentinel.getBoundingClientRect().top < window.innerHeight + 200) more();
            }, 350);
        }
        if (sentinel) {
            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) more(); }, { rootMargin: '300px 0px' }).observe(sentinel);
            } else {
                window.addEventListener('scroll', function () { if (sentinel.getBoundingClientRect().top < window.innerHeight + 300) more(); });
            }
        }
        if (desktop.addEventListener) desktop.addEventListener('change', render);

        // قبل أي تبديل: حدث shary:project-units ({ tab, sort, filters, url }) — امنعوه لو الكروت هتيجي من السيرفر
        function apply(url) {
            var filters = {};
            if (form && window.FormData) new FormData(form).forEach(function (value, key) { if (value !== '') (filters[key] = filters[key] || []).push(value); });
            var detail = { tab: current(tabs, 'data-unit-tab'), sort: sortValue(), filters: filters, url: url || '' };
            if (!section.dispatchEvent(new CustomEvent('shary:project-units', { bubbles: true, cancelable: true, detail: detail }))) return;
            page = 1;
            shown = STEP;
            render();
        }

        tabs.forEach(function (link) {
            link.addEventListener('click', function (event) {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
                event.preventDefault();
                tabs.forEach(function (item) { item.setAttribute('aria-current', item === link ? 'true' : 'false'); });
                apply(link.href);
                var href = link.getAttribute('href') || '';
                if (href && href.charAt(0) !== '#' && window.history && history.replaceState) {
                    try { history.replaceState(history.state, '', link.href); } catch (error) { /* file:// */ }
                }
            });
        });

        // فورم الفلاتر والترتيب: "عرض النتائج" / "مسح" / اختيار ترتيب بيطلعوا حدث shary:filter (js/shary/area-page.js) —
        // هنا الفلترة بتتم على كروت الصفحة من غير ما الفورم يتبعت ولا الصفحة تتحمّل
        if (form) {
            form.addEventListener('shary:filter', function (event) {
                event.preventDefault();
                event.stopPropagation();
                apply(form.getAttribute('action') || '');
                var top = section.getBoundingClientRect().top;
                if (top < 0) window.scrollTo({ top: window.pageYOffset + top - 150, behavior: 'smooth' });
            });
        }

        // لو الكروت اتبدّلت من بره (مثلاً من السيرفر): section.__renderUnits() بيعيد العرض من أول صفحة
        section.__renderUnits = function () { page = 1; shown = STEP; render(); };
        render();
    });
})();

/**
 * صفحة Shary AI (partials/ai-panel.blade.php)
 * - أي عنصر عليه data-ask-ai بيفتح الصفحة (بتطلع من تحت). القفل من السهم أو الضغط براها أو Esc.
 * - الإرسال (الكتابة أو اختيار منطقة): الرسالة بتتضاف، وبيطلع حدث shary:ai-send على الصفحة:
 *       panel.addEventListener('shary:ai-send', function (event) { event.preventDefault(); event.detail.reply('نص الرد'); });
 *   لو الحدث ما اتمنعش وفيه data-endpoint: الرسالة بتتبعت POST JSON {message} والرد المتوقع JSON {reply}.
 * - النقط التلاتة: محادثة جديدة. المايك بيظهر بس لو المتصفح بيدعم الإملاء الصوتي.
 */
(function () {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-ai-panel]'));
    if (!panels.length) return;

    panels.forEach(function (panel) {
        var list = panel.querySelector('[data-ai-messages]');
        var scroll = panel.querySelector('[data-ai-scroll]');
        var suggestions = panel.querySelector('[data-ai-suggestions]');
        var form = panel.querySelector('[data-ai-form]');
        var input = form.querySelector('input[name="message"]');
        var opener = null;

        function bubble(text, mine) {
            var node = document.createElement('div');
            node.className = mine ? 'area-ai-msg area-ai-msg--mine' : 'area-ai-msg';
            node.setAttribute('data-ai-added', '');
            var p = document.createElement('p');
            p.textContent = text;
            node.appendChild(p);
            list.appendChild(node);
            scroll.scrollTop = scroll.scrollHeight;
            return node;
        }

        function send(text) {
            text = String(text || '').trim();
            if (!text) return;
            bubble(text, true);
            input.value = '';
            if (suggestions) suggestions.classList.add('hidden');

            var typing = bubble('…', false);
            typing.classList.add('area-ai-msg--typing');
            var done = false;
            function reply(answer) {
                if (done) return;
                done = true;
                typing.remove();
                if (answer) bubble(answer, false);
            }

            var go = panel.dispatchEvent(new CustomEvent('shary:ai-send', { bubbles: true, cancelable: true, detail: { text: text, reply: reply } }));
            if (!go) return;

            var endpoint = panel.getAttribute('data-endpoint');
            if (!endpoint) { reply(''); return; }
            var token = document.querySelector('meta[name="csrf-token"]');
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': token ? token.getAttribute('content') : '' },
                body: JSON.stringify({ message: text })
            }).then(function (response) { return response.json(); }).then(function (data) { reply(data && data.reply); }).catch(function () { reply(''); });
        }

        function open(from) {
            if (!panel.classList.contains('hidden')) return;
            opener = from || null;
            panel.classList.remove('hidden');
            document.documentElement.style.overflow = 'hidden';
            // زرار الرجوع بيقفل الصفحة دي والعميل بيفضل في صفحته
            if (window.SharyBack) window.SharyBack.opened(close);
        }
        function close() {
            if (panel.classList.contains('hidden')) return;
            panel.classList.add('hidden');
            document.documentElement.style.overflow = '';
            if (opener) opener.focus({ preventScroll: true });
            if (window.SharyBack) window.SharyBack.closed();
        }
        panel.sharyOpen = open;

        panel.querySelectorAll('[data-ai-close]').forEach(function (node) { node.addEventListener('click', close); });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });
        form.addEventListener('submit', function (event) { event.preventDefault(); send(input.value); });
        panel.querySelectorAll('[data-ai-suggest]').forEach(function (button) {
            button.addEventListener('click', function () { send(button.textContent); });
        });

        var reset = panel.querySelector('[data-ai-reset]');
        if (reset) {
            reset.addEventListener('click', function () {
                list.querySelectorAll('[data-ai-added]').forEach(function (node) { node.remove(); });
                if (suggestions) suggestions.classList.remove('hidden');
                input.value = '';
                scroll.scrollTop = 0;
            });
        }

        // الإملاء الصوتي (لو المتصفح بيدعمه)
        var mic = panel.querySelector('[data-ai-mic]');
        var Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (mic && Speech) {
            mic.classList.remove('hidden');
            mic.classList.add('flex');
            var listening = null;
            mic.addEventListener('click', function () {
                if (listening) { listening.stop(); return; }
                var langNode = panel.closest('[lang]');
                var recognition = new Speech();
                recognition.lang = ((langNode && langNode.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0 ? 'en-US' : 'ar-EG';
                recognition.onresult = function (event) { input.value = event.results[0][0].transcript; input.focus(); };
                recognition.onend = recognition.onerror = function () { listening = null; mic.setAttribute('aria-pressed', 'false'); };
                listening = recognition;
                mic.setAttribute('aria-pressed', 'true');
                try { recognition.start(); } catch (error) { listening = null; mic.setAttribute('aria-pressed', 'false'); }
            });
        }
    });

    // أي زرار Shary AI بيفتح الصفحة الأقرب له
    document.addEventListener('click', function (event) {
        var opener = event.target.closest ? event.target.closest('[data-ask-ai]') : null;
        if (!opener) return;
        var scope = opener.closest('main');
        var panel = (scope && scope.querySelector('[data-ai-panel]')) || document.querySelector('[data-ai-panel]');
        if (!panel || !panel.sharyOpen) return;
        event.preventDefault();
        panel.sharyOpen(opener);
    });
})();

