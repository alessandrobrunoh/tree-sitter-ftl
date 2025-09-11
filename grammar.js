module.exports = grammar({
  name: 'ftl',

  conflicts: $ => [
    [$.named_parameter, $.expression],
    [$.directive, $._definition]
  ],

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.content,
      $.directive,
      $.interpolation,
      $.comment,
      $.end_directive
    ),

    content: $ => /[^<$#]+/,

    // The fix: add prec.right to block_content
    block_content: $ => prec.right(repeat1(choice(
      $.content,
      $.interpolation,
      $.comment,
      $.directive
    ))),

    directive: $ => choice(
      $.import_directive,
      $.macro_directive,
      $.if_directive,
      $.list_directive,
      $.items_directive,
      $.assign_directive,
      $.end_directive,
      $.macro_call,
      $.end_macro_call
    ),

    import_directive: $ => seq(
      '<#import',
      $.string,
      'as',
      $.identifier,
      '>'
    ),

    macro_directive: $ => seq(
      '<#macro',
      $.identifier,
      repeat($.parameter),
      '>'
    ),

    macro_call: $ => seq(
      '<@',
      $.qualified_identifier,
      repeat($.named_parameter),
      optional(seq(';', $.identifier)),
      '>'
    ),

    end_macro_call: $ => seq(
      '</@',
      $.qualified_identifier,
      '>'
    ),

    if_directive: $ => seq(
      '<#if',
      field('condition', $.expression),
      '>',
      optional($.block_content),
      repeat($.elseif_branch),
      optional($.else_branch),
      '</#if>'
    ),

    elseif_branch: $ => seq(
      '<#elseif',
      field('condition', $.expression),
      '>',
      optional($.block_content)
    ),

    else_branch: $ => seq(
      '<#else>',
      optional($.block_content)
    ),

    list_directive: $ => seq(
      '<#list',
      field('collection', $.expression),
      optional(seq('as', field('variable', $.identifier))),
      '>',
      optional($.block_content),
      '</#list>'
    ),

    items_directive: $ => seq(
      '<#items',
      'as',
      field('variable', $.identifier),
      '>',
      optional($.block_content),
      '</#items>'
    ),

    assign_directive: $ => seq(
      '<#assign',
      field('name', $.identifier),
      '=',
      field('value', $.expression),
      '>'
    ),

    end_directive: $ => seq(
      '</#',
      $.identifier,
      '>'
    ),

    interpolation: $ => seq(
      '${',
      $.expression,
      '}'
    ),

    expression: $ => choice(
      $.string,
      $.number,
      $.boolean,
      $.qualified_identifier,
      $.function_call,
      $.binary_expression,
      $.unary_expression,
      $.built_in_op,
      seq('(', $.expression, ')')
    ),

    binary_expression: $ => prec.left(choice(
      seq($.expression, '==', $.expression),
      seq($.expression, '!=', $.expression),
      seq($.expression, '=', $.expression),
      seq($.expression, '<', $.expression),
      seq($.expression, '>', $.expression),
      seq($.expression, '<=', $.expression),
      seq($.expression, '>=', $.expression),
      seq($.expression, '+', $.expression),
      seq($.expression, '-', $.expression),
      seq($.expression, '*', $.expression),
      seq($.expression, '/', $.expression),
      seq($.expression, '||', $.expression),
      seq($.expression, '&&', $.expression)
    )),

    unary_expression: $ => prec.right(choice(
      seq('!', $.expression),
      seq('-', $.expression)
    )),

    function_call: $ => seq(
      $.qualified_identifier,
      '(',
      optional(sep($.expression, ',')),
      ')'
    ),

    built_in_op: $ => prec.left(seq(
      $.expression,
      choice(
        '?has_content',
        '?keep_before',
        '?no_esc',
        '?upper_case',
        '?lower_case',
        '?cap_first',
        '?trim',
        '?length',
        seq('?', $.identifier)
      ),
      optional(seq('(', $.expression, ')'))
    )),

    parameter: $ => $.identifier,

    named_parameter: $ => prec(1, seq(
      $.identifier,
      '=',
      $.expression
    )),

    qualified_identifier: $ => prec.right(seq(
      $.identifier,
      repeat(seq('.', $.identifier))
    )),

    string: $ => choice(
      seq('"', repeat(/[^"\\]|\\.?/), '"'),
      seq("'", repeat(/[^'\\]|\\.?/), "'")
    ),

    number: $ => /\d+(\.\d+)?/,
    boolean: $ => choice('true', 'false'),
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: $ => seq(
      '<#--',
      /[^-]*(-[^-])*(-(-[^>])?)*-->/
    )
  },

  extras: $ => [
    /\s/
  ]
});

// Helper function for comma-separated lists
function sep(rule, separator) {
  return optional(seq(rule, repeat(seq(separator, rule))));
}
