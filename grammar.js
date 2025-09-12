module.exports = grammar({
  name: 'ftl',

  extras: $ => [
    $.line_comment,
    $.block_comment,
    /\s/
  ],

  rules: {
    source_file: $ => repeat($._definition),

    // Comments are handled in extras
    line_comment: $ => token(seq('//', /.*/)),

    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/'
    )),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    html_tag: $ => seq(
      '<',
      optional(choice(
        $.identifier,
      )),
      '>'
    ),

    variable: $ => seq(
      '${',
        repeat($.variable_declaration),
      '}'
    ),

    variable_declaration: $ => seq(
      $.identifier,
    ),

    _definition: $ => choice(
      $.html_tag,
      $.variable,
      $.variable_declaration,
    ),
  }
});

// Helper function for comma-separated lists
function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
