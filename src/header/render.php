<?php
/**
 * Render template dla bloku Header.
 *
 * @var array    $attributes Atrybuty bloku.
 * @var string   $content    Zawartość InnerBlocks (nieużywana).
 * @var WP_Block $block      Instancja bloku.
 */

$tytul           = $attributes['tytul'] ?? '';
$podtytul        = $attributes['podtytul'] ?? '';
$ikona           = $attributes['ikona'] ?? null;
$szerokosc_ikony = isset( $attributes['szerokoscIkony'] ) ? intval( $attributes['szerokoscIkony'] ) : null;

$ikona_style = $szerokosc_ikony
	? ' style="width:' . $szerokosc_ikony . 'px;height:auto;"'
	: '';

$sekcja_style  = bs_block_sekcja_style( $attributes );
$wrapper_args  = [ 'class' => 'blok-header' ];
if ( $sekcja_style ) {
	$wrapper_args['style'] = $sekcja_style;
}
$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
?>
<div <?php echo $wrapper_attributes; ?>>

	<?php if ( $ikona ) : ?>
		<div class="blok-header__ikona">
			<img
				src="<?php echo esc_url( $ikona['url'] ); ?>"
				alt="<?php echo esc_attr( $ikona['alt'] ); ?>"
				<?php echo $ikona_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			/>
		</div>
	<?php endif; ?>

	<?php if ( $tytul ) : ?>
		<h2 class="blok-header__tytul"><?php echo wp_kses_post( $tytul ); ?></h2>
	<?php endif; ?>

	<?php if ( $podtytul ) : ?>
		<p class="blok-header__podtytul"><?php echo wp_kses_post( $podtytul ); ?></p>
	<?php endif; ?>

</div>
