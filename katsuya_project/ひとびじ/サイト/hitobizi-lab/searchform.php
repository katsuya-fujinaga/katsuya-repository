<?php
/**
 * Search form
 *
 * @package Hitobizi_Lab
 */
?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="s">検索</label>
	<input type="search" id="s" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="記事を検索">
	<button type="submit" class="btn btn-outline">検索</button>
</form>
