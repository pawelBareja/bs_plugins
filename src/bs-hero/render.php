<?php
/**
 * Render template for bs-plugins/hero
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Inner block content (InnerBlocks).
 */

$obrazek        = $attributes['obrazek'] ?? null;
$tytul          = $attributes['tytul'] ?? '';
$margines_gorny = intval( $attributes['marginesGorny'] ?? 0 );
$wysokosc_vh    = intval( $attributes['wysokoscVh'] ?? 100 );

$inline_styles = [];

$inline_styles[] = '--blok-hero-vh: ' . $wysokosc_vh;

if ( ! empty( $obrazek['url'] ) ) {
	$inline_styles[] = 'background-image: url(' . esc_url( $obrazek['url'] ) . ')';
}

if ( $margines_gorny > 0 ) {
	$inline_styles[] = 'margin-top: -' . $margines_gorny . 'px';
	$inline_styles[] = 'padding-top: ' . $margines_gorny . 'px';
}

$extra_attrs = [ 'class' => 'blok-hero' ];
if ( $inline_styles ) {
	$extra_attrs['style'] = implode( '; ', $inline_styles );
}

$wrapper_attrs = get_block_wrapper_attributes( $extra_attrs );
?>
<div <?php echo $wrapper_attrs; ?>>
	<div class="blok-hero__zawartosc">
		<?php if ( $tytul ) : ?>
			<h1 class="blok-hero__tytul"><?php echo wp_kses_post( $tytul ); ?></h1>
		<?php endif; ?>
		<?php if ( $content ) : ?>
			<div class="blok-hero__przyciski"><?php echo $content; ?></div>
		<?php endif; ?>
	</div>
</div>
