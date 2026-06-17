<?php
/**
 * Render template for bs-plugins/bs-features
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Inner block content.
 */

$liczba   = intval( $attributes['liczbaElementow'] ?? 3 );
$elementy = array_slice( $attributes['elementy'] ?? [], 0, $liczba );

$sekcja_style  = bs_block_sekcja_style( $attributes );
$blok_style    = '--bs-features-cols: ' . $liczba . ( $sekcja_style ? '; ' . $sekcja_style : '' );
$wrapper_attrs = get_block_wrapper_attributes( [
	'class' => 'blok-features',
	'style' => $blok_style,
] );
?>
<div <?php echo $wrapper_attrs; ?>>
	<?php foreach ( $elementy as $el ) : ?>
		<div class="blok-features__element">
			<?php if ( ! empty( $el['numer'] ) ) : ?>
				<p class="blok-features__numer"><?php echo wp_kses_post( $el['numer'] ); ?></p>
			<?php endif; ?>
			<?php if ( ! empty( $el['tytul'] ) ) : ?>
				<h3 class="blok-features__tytul"><?php echo wp_kses_post( $el['tytul'] ); ?></h3>
			<?php endif; ?>
			<?php if ( ! empty( $el['tresc'] ) ) : ?>
				<p class="blok-features__tresc"><?php echo wp_kses_post( $el['tresc'] ); ?></p>
			<?php endif; ?>
		</div>
	<?php endforeach; ?>
</div>
