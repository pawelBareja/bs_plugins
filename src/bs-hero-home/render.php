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
$tekst_kalendarz     = trim( $attributes['tekstKalendarz'] ?? '' );

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
	<div class="blok-hero-home__inner">
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
			<div class="blok-hero-home__dostawa" hidden>
				<svg class="blok-hero-home__dostawa-ikona" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M208,36H180V24a4,4,0,0,0-8,0V36H84V24a4,4,0,0,0-8,0V36H48A12,12,0,0,0,36,48V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V48A12,12,0,0,0,208,36ZM48,44H76V56a4,4,0,0,0,8,0V44h88V56a4,4,0,0,0,8,0V44h28a4,4,0,0,1,4,4V84H44V48A4,4,0,0,1,48,44ZM208,212H48a4,4,0,0,1-4-4V92H212V208A4,4,0,0,1,208,212ZM108,120v64a4,4,0,0,1-8,0V126.47l-10.21,5.11a4,4,0,0,1-3.58-7.16l16-8A4,4,0,0,1,108,120Zm60,28-24,32h24a4,4,0,0,1,0,8H136a4,4,0,0,1-3.2-6.4l28.78-38.37A11.88,11.88,0,0,0,164,136a12,12,0,0,0-22.4-6,4,4,0,0,1-6.92-4A20,20,0,0,1,172,136,19.79,19.79,0,0,1,168,148Z"></path></svg>
				<span class="blok-hero-home__dostawa-tekst">
					<span
						class="blok-hero-home__dostawa-linia1"
						data-dostawa-szablon="Najbliższa możliwa dostawa w %s"
					></span>
					<span class="blok-hero-home__dostawa-linia2"></span>
				</span>
			</div>
			<?php if ( $tekst_kalendarz ) : ?>
				<div class="blok-hero-home__kalendarz">
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M208,36H180V24a4,4,0,0,0-8,0V36H84V24a4,4,0,0,0-8,0V36H48A12,12,0,0,0,36,48V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V48A12,12,0,0,0,208,36ZM48,44H76V56a4,4,0,0,0,8,0V44h88V56a4,4,0,0,0,8,0V44h28a4,4,0,0,1,4,4V84H44V48A4,4,0,0,1,48,44ZM208,212H48a4,4,0,0,1-4-4V92H212V208A4,4,0,0,1,208,212ZM108,120v64a4,4,0,0,1-8,0V126.47l-10.21,5.11a4,4,0,0,1-3.58-7.16l16-8A4,4,0,0,1,108,120Zm60,28-24,32h24a4,4,0,0,1,0,8H136a4,4,0,0,1-3.2-6.4l28.78-38.37A11.88,11.88,0,0,0,164,136a12,12,0,0,0-22.4-6,4,4,0,0,1-6.92-4A20,20,0,0,1,172,136,19.79,19.79,0,0,1,168,148Z"></path></svg>
					<span><?php echo esc_html( $tekst_kalendarz ); ?></span>
				</div>
			<?php endif; ?>
		</div>
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
	<?php if ( $tekst_boczny ) : ?>
		<span class="blok-hero-home__tekst-boczny"><?php echo esc_html( $tekst_boczny ); ?></span>
	<?php endif; ?>
</div>
