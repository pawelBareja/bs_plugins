<?php
/**
 * Render template dla bloku BS USP.
 *
 * @var array $attributes Atrybuty bloku.
 */

$obrazek   = $attributes['obrazek'] ?? null;
$tresc     = $attributes['tresc'] ?? '';
$kolor     = $attributes['kolorKsztaltu'] ?? '#f1efeb';
$szerokosc = (int) ( $attributes['szerokoscKsztaltu'] ?? 380 );
$wysokosc  = (int) ( $attributes['wysokoscKsztaltu'] ?? 420 );

$scena_style = sprintf(
	'--bs-usp-ksztalt-color: %s; --bs-usp-ksztalt-width: %dpx; --bs-usp-ksztalt-height: %dpx;',
	esc_attr( $kolor ),
	$szerokosc,
	$wysokosc
);

$sekcja_style = bs_block_sekcja_style( $attributes );
$wrapper_args = [ 'class' => 'blok-usp' ];
if ( $sekcja_style ) {
	$wrapper_args['style'] = $sekcja_style;
}
?>
<div <?php echo get_block_wrapper_attributes( $wrapper_args ); ?>>
	<div class="blok-usp__scena" style="<?php echo esc_attr( $scena_style ); ?>">
		<div class="blok-usp__ksztalt"></div>
		<?php if ( ! empty( $obrazek['url'] ) ) : ?>
			<div class="blok-usp__obrazek-wrapper">
				<img
					src="<?php echo esc_url( $obrazek['url'] ); ?>"
					alt="<?php echo esc_attr( $obrazek['alt'] ?? '' ); ?>"
					class="blok-usp__obrazek"
				/>
			</div>
		<?php endif; ?>
	</div>
	<?php if ( $tresc ) : ?>
		<div class="blok-usp__tresc"><?php echo wp_kses_post( $tresc ); ?></div>
	<?php endif; ?>
</div>
