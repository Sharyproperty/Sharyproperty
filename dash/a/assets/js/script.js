/* stand-in for the template's script.js (testing / preview only): the behaviours the old screens rely on */
(function($){ 'use strict';
  $(window).on('load', function(){ $('#global-loader').fadeOut('slow') }); setTimeout(function(){ $('#global-loader').hide() }, 1500);
  if (window.feather) { feather.replace() }
  if ($.fn.DataTable) {
    if ($('.datatable').length) { $('.datatable').each(function(){ if(!$.fn.DataTable.isDataTable(this)){ $(this).DataTable({ bFilter:false }) } }) }
    if ($('.datanew').length) { $('.datanew').each(function(){ if(!$.fn.DataTable.isDataTable(this)){ $(this).DataTable({ bFilter:true, sDom:'fBtlpi', pagingType:'numbers', ordering:true,
      language:{ search:' ', sLengthMenu:'_MENU_', searchPlaceholder:'Search...', info:'_START_ - _END_ of _TOTAL_ items' },
      initComplete:function(){ $('.dataTables_filter').appendTo('#tableSearch'); $('.dataTables_filter').appendTo('.search-input') } }) } }) }
  }
  if ($.fn.select2) { if ($('.select').length) { $('.select').select2({ minimumResultsForSearch:-1, width:'100%' }) } if ($('.js-example-basic-single').length) { $('.js-example-basic-single').select2({ width:'100%' }) } }
  $(document).on('click', '#filter_search', function(){ $('#filter_inputs').slideToggle('slow'); $(this).toggleClass('setclose') });
  $(document).on('click', '.toggle-password', function(){ var i=$(this).closest('.pass-group').find('.pass-input'); i.attr('type', i.attr('type')==='password'?'text':'password') });
  $(document).on('click', '#mobile_btn', function(){ $('html').toggleClass('menu-opened'); return false });
  $(document).on('click', '#toggle_btn', function(){ $('body').toggleClass('mini-sidebar'); return false });
})(jQuery);
