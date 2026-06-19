<?php
/**
 * Render template for bs-plugins/bs-produkty-slider
 *
 * @var array $attributes Block attributes.
 */

if ( ! class_exists( 'WooCommerce' ) ) {
	return;
}

$zrodlo          = $attributes['zrodloProduktow'] ?? 'najnowsze';
$kategoria_slug  = $attributes['kategoriaSlug'] ?? '';
$tag_slug        = $attributes['tagSlug'] ?? '';
$liczba          = max( 2, (int) ( $attributes['liczbaProduktow'] ?? 5 ) );
$predkosc        = max( 1, (int) ( $attributes['predkosc'] ?? 4 ) );
$tekst_przycisku = $attributes['tekstPrzycisku'] ?? 'Kup teraz';

$query_args = [
	'post_type'      => 'product',
	'post_status'    => 'publish',
	'posts_per_page' => $liczba,
	'orderby'        => 'date',
	'order'          => 'DESC',
	'no_found_rows'  => true,
];

if ( 'kategoria' === $zrodlo && $kategoria_slug ) {
	$query_args['tax_query'] = [
		[
			'taxonomy' => 'product_cat',
			'field'    => 'slug',
			'terms'    => sanitize_title( $kategoria_slug ),
		],
	];
} elseif ( 'tag' === $zrodlo && $tag_slug ) {
	$query_args['tax_query'] = [
		[
			'taxonomy' => 'product_tag',
			'field'    => 'slug',
			'terms'    => sanitize_title( $tag_slug ),
		],
	];
}

$query = new WP_Query( $query_args );

if ( ! $query->have_posts() ) {
	return;
}

$sekcja_style = bs_block_sekcja_style( $attributes );
$wrapper_args = [ 'class' => 'blok-produkty-slider' ];
if ( $sekcja_style ) {
	$wrapper_args['style'] = $sekcja_style;
}
$wrapper_attrs = get_block_wrapper_attributes( $wrapper_args );
?>
<div <?php echo $wrapper_attrs; ?> data-predkosc="<?php echo esc_attr( $predkosc ); ?>">
	<div class="blok-produkty-slider__track">
		<?php
		while ( $query->have_posts() ) :
			$query->the_post();
			$product = wc_get_product( get_the_ID() );

			if ( ! $product ) {
				continue;
			}
			?>
			<div class="blok-produkty-slider__slide">
				<a href="<?php echo esc_url( get_permalink() ); ?>" class="blok-produkty-slider__obrazek-link">
					<?php if ( has_post_thumbnail() ) : ?>
						<?php echo get_the_post_thumbnail( get_the_ID(), 'medium', [ 'class' => 'blok-produkty-slider__obrazek' ] ); ?>
					<?php else : ?>
						<span class="blok-produkty-slider__obrazek blok-produkty-slider__obrazek--placeholder" aria-hidden="true">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
								<circle cx="24" cy="15" r="8" opacity="0.5" />
								<circle cx="33" cy="24" r="8" opacity="0.5" />
								<circle cx="24" cy="33" r="8" opacity="0.5" />
								<circle cx="15" cy="24" r="8" opacity="0.5" />
								<circle cx="24" cy="24" r="6" />
							</svg>
						</span>
					<?php endif; ?>
				</a>
				<h3 class="blok-produkty-slider__nazwa">
					<a href="<?php echo esc_url( get_permalink() ); ?>"><?php echo esc_html( $product->get_name() ); ?></a>
				</h3>
				<div class="blok-produkty-slider__cena"><?php echo $product->get_price_html(); ?></div>
				<a href="<?php echo esc_url( get_permalink() ); ?>" class="blok-produkty-slider__przycisk">
					<?php echo esc_html( $tekst_przycisku ); ?>
				</a>
			</div>
			<?php
		endwhile;
		wp_reset_postdata();
		?>
	</div>
	<?php if ( $query->post_count > 1 ) : ?>
		<div class="blok-produkty-slider__dots">
			<?php for ( $i = 0; $i < $query->post_count; $i++ ) : ?>
				<button
					type="button"
					class="blok-produkty-slider__dot<?php echo 0 === $i ? ' is-active' : ''; ?>"
					data-slide="<?php echo esc_attr( $i ); ?>"
					aria-label="<?php echo esc_attr( sprintf( 'Slajd %d', $i + 1 ) ); ?>"
				></button>
			<?php endfor; ?>
		</div>
	<?php endif; ?>
</div>
