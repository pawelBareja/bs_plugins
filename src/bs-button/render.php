<?php
/**
 * Render template for bs-plugins/bs-button
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Inner block content.
 */

$etykieta      = $attributes['etykieta'] ?? '';
$url           = $attributes['url'] ?? '';
$wariant       = $attributes['wariant'] ?? 'bialy';
$rozmiar       = $attributes['rozmiar'] ?? 'md';
$nowy_tab      = ! empty( $attributes['nowyTab'] );
$scroll_offset = intval( $attributes['scrollOffset'] ?? 0 );
$ikona_svg     = $attributes['ikonaSvg'] ?? '';
$ikona_pozycja = $attributes['ikonaPozycja'] ?? 'start';

$btn_class = implode( ' ', [
	'blok-przycisk',
	'blok-przycisk--' . esc_attr( $wariant ),
	'blok-przycisk--' . esc_attr( $rozmiar ),
] );

$ikona_html = $ikona_svg
	? '<span class="blok-przycisk__ikona" aria-hidden="true">' . $ikona_svg . '</span>'
	: '';

$btn_content = ( $ikona_html && 'start' === $ikona_pozycja ? $ikona_html : '' )
	. wp_kses_post( $etykieta )
	. ( $ikona_html && 'end' === $ikona_pozycja ? $ikona_html : '' );

$sekcja_style = bs_block_sekcja_style( $attributes );
$wrapper_args = [ 'class' => 'blok-przycisk-wrapper' ];
if ( $sekcja_style ) {
	$wrapper_args['style'] = $sekcja_style;
}
$wrapper_attrs = get_block_wrapper_attributes( $wrapper_args );

$is_anchor = str_starts_with( $url, '#' );
$target    = ( ! $is_anchor && $nowy_tab ) ? ' target="_blank" rel="noopener noreferrer"' : '';
$data_offset = $is_anchor ? ' data-scroll-offset="' . esc_attr( $scroll_offset ) . '"' : '';
?>
<div <?php echo $wrapper_attrs; ?>>
	<?php if ( $url ) : ?>
		<a
			href="<?php echo esc_url( $url ); ?>"
			class="<?php echo esc_attr( $btn_class ); ?>"
			<?php echo $target . $data_offset; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		><?php echo $btn_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></a>
	<?php else : ?>
		<span class="<?php echo esc_attr( $btn_class ); ?>"><?php echo $btn_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
	<?php endif; ?>
</div>
