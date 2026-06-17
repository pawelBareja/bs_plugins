<?php
/**
 * Render template for bs-plugins/bs-icons-bar
 *
 * @var array $attributes Block attributes.
 */

$liczba = intval( $attributes['liczbaElementow'] ?? 3 );
$liczba = max( 2, min( 5, $liczba ) );

$elementy = array_slice( $attributes['elementy'] ?? [], 0, $liczba );

$allowed_svg = [
	'svg'  => [
		'xmlns'               => true,
		'viewbox'             => true,
		'fill'                => true,
		'preserveaspectratio' => true,
		'aria-hidden'         => true,
	],
	'g'    => [
		'transform' => true,
	],
	'path' => [
		'd'          => true,
		'fill'       => true,
		'fill-rule'  => true,
		'clip-rule'  => true,
		'stroke'     => true,
		'stroke-width' => true,
	],
];

$wave_svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 176' preserveAspectRatio='none' aria-hidden='true'><g transform='translate(-417,-1)'><path fill='currentColor' fill-rule='nonzero' d='M427.859333,1.61373035 L428.837883,1.40771987 L428.940888,1.89699476 C434.23118,27.0258836 432.657144,56.7108204 424.22674,90.9521835 L423.936684,92.1212678 C415.384901,126.328399 416.925439,153.988202 428.532588,175.116614 L429.132531,176.190657 L428.260956,176.680918 L428.015825,176.245131 C416.066337,155.001596 414.305898,127.221293 422.708797,92.9201565 L422.966542,91.8787322 C431.518889,57.6693434 433.240353,28.0282977 428.138895,2.95597365 L427.859333,1.61373035 Z'/></g></svg>";

$sekcja_style = bs_block_sekcja_style( $attributes );
$wrapper_args = [ 'class' => 'blok-icons-bar' ];
if ( $sekcja_style ) {
	$wrapper_args['style'] = $sekcja_style;
}
$wrapper_attrs = get_block_wrapper_attributes( $wrapper_args );
?>
<div <?php echo $wrapper_attrs; ?>>
	<?php foreach ( $elementy as $i => $el ) : ?>
		<?php if ( $i > 0 ) : ?>
			<span class="blok-icons-bar__divider"><?php echo wp_kses( $wave_svg, $allowed_svg ); ?></span>
		<?php endif; ?>
		<div class="blok-icons-bar__item">
			<span class="blok-icons-bar__icon"><?php echo wp_kses( $el['ikona'] ?? '', $allowed_svg ); ?></span>
			<?php if ( ! empty( $el['tekst'] ) ) : ?>
				<span class="blok-icons-bar__tekst"><?php echo wp_kses_post( $el['tekst'] ); ?></span>
			<?php endif; ?>
		</div>
	<?php endforeach; ?>
</div>
