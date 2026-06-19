<?php
/**
 * Render template for bs-plugins/bs-hero-home
 *
 * @var array  $attributes Block attributes.
 * @var string $content    Inner block content (przycisk).
 */

$tytul     = $attributes['tytul'] ?? '';
$obrazek   = $attributes['obrazek'] ?? null;
$kolor_tla           = $attributes['kolorTla'] ?? '#fbfbfb';
$tekst_boczny        = trim( $attributes['tekstBoczny'] ?? 'pracownia florystyczna' );
$kolor_tekstu_boczny = $attributes['kolorTekstuBocznego'] ?? '#111111';

$teksty = array_values( array_filter(
	$attributes['teksty'] ?? [],
	static function ( $tekst ) {
		return trim( $tekst ) !== '';
	}
) );

$sekcja_style  = bs_block_sekcja_style( $attributes );
$blok_style    = '--bs-hero-home-bg: ' . esc_attr( $kolor_tla ) . '; --bs-hero-home-tekst-boczny-kolor: ' . esc_attr( $kolor_tekstu_boczny ) . ( $sekcja_style ? '; ' . $sekcja_style : '' );
$wrapper_attrs = get_block_wrapper_attributes( [
	'class' => 'blok-hero-home',
	'style' => $blok_style,
] );
?>
<div <?php echo $wrapper_attrs; ?>>
	<div class="blok-hero-home__content">
		<?php if ( $tytul ) : ?>
			<h1 class="blok-hero-home__tytul"><?php echo wp_kses_post( $tytul ); ?></h1>
		<?php endif; ?>
		<?php if ( $teksty ) : ?>
			<div class="blok-hero-home__rotator">
				<?php foreach ( $teksty as $i => $tekst ) : ?>
					<span class="blok-hero-home__rotator-item<?php echo 0 === $i ? ' is-active' : ''; ?>">
						<?php echo esc_html( $tekst ); ?>
					</span>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
		<?php if ( $content ) : ?>
			<div class="blok-hero-home__przyciski"><?php echo $content; ?></div>
		<?php endif; ?>
	</div>
	<?php if ( $tekst_boczny ) : ?>
		<span class="blok-hero-home__tekst-boczny"><?php echo esc_html( $tekst_boczny ); ?></span>
	<?php endif; ?>
	<?php if ( ! empty( $obrazek['url'] ) ) : ?>
		<div class="blok-hero-home__obrazek-wrapper">
			<img
				src="<?php echo esc_url( $obrazek['url'] ); ?>"
				alt="<?php echo esc_attr( $obrazek['alt'] ?? '' ); ?>"
				class="blok-hero-home__obrazek"
			/>
		</div>
	<?php endif; ?>
</div>
